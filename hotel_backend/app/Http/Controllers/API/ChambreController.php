<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Chambre;
use App\Models\TypeChambre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ChambreController extends Controller {
    
    // Recherche chambres disponibles
    public function rechercher(Request $request) {
        $validator = Validator::make($request->all(), [
            'date_arrivee' => 'nullable|date',
            'date_depart' => 'nullable|date|after:date_arrivee',
            'type_chambre_id' => 'integer|exists:types_chambre,id',
            'capacite_min' => 'integer|min:1'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        $query = Chambre::with(['typeChambre', 'images'])
            ->where('statut', 'disponible');
        
        // Filtrer par type
        if ($request->type_chambre_id) {
            $query->where('type_chambre_id', $request->type_chambre_id);
        }
        
        // Filtrer par capacité
        if ($request->capacite_min) {
            $query->whereHas('typeChambre', function($q) use ($request) {
                $q->where('capacite', '>=', $request->capacite_min);
            });
        }
        
        $chambres = $query->get();
        
        // Filtrer par disponibilité seulement si les dates sont fournies
        $chambresDisponibles = $chambres;
        if ($request->date_arrivee && $request->date_depart) {
            $chambresDisponibles = $chambres->filter(function($chambre) use ($request) {
                return $chambre->estDisponible($request->date_arrivee, $request->date_depart);
            });
        }
        
        // Calculer prix avec tarifs saisonniers
        $chambresDisponibles->each(function($chambre) use ($request) {
            $chambre->prix_calcule = $chambre->typeChambre->prix_base;
        });
        
        return response()->json([
            'success' => true,
            'chambres' => $chambresDisponibles->values(),
            'count' => $chambresDisponibles->count()
        ]);
    }
    
    // Détails d'une chambre
    public function show($id) {
        $chambre = Chambre::with(['typeChambre', 'images', 'reservations' => function($q) {
            $q->whereIn('statut', ['confirmee', 'en_attente'])
              ->where('date_depart', '>=', now())
              ->select('id', 'chambre_id', 'date_arrivee', 'date_depart');
        }])->find($id);
        
        if (!$chambre) {
            return response()->json(['error' => 'Chambre non trouvée'], 404);
        }
        
        return response()->json(['success' => true, 'data' => $chambre]);
    }
    
    // Lister toutes les chambres (Admin)
    public function index() {
        $chambres = Chambre::with(['typeChambre', 'images'])->orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $chambres]);
    }
    
    // CRUD pour admin ... (the rest of the file)
    public function store(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'numero' => 'required|string|unique:chambres',
                'etage' => 'required|integer',
                'type_chambre_id' => 'required|exists:types_chambre,id',
                'statut' => 'in:disponible,occupee,maintenance',
                'image_urls' => 'nullable|array',
                'image_urls.*' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,mov,avi,wmv,webm|max:51200' // Increased to 50MB for videos
            ]);

            if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 400);

            $chambre = Chambre::create($request->except(['image_urls', 'images', 'image']));
            
            // Traiter les URLs d'images/vidéos
            if ($request->image_urls) {
                foreach ($request->image_urls as $index => $url) {
                    if ($url) {
                        // Detect media type from URL extension
                        $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));
                        $isVideo = in_array($extension, ['mp4', 'mov', 'avi', 'wmv', 'webm']);
                        
                        // Check if explicit type is provided OR use keywords
                        $mediaType = $request->media_types[$index] ?? null;
                        if (!$mediaType) {
                            $mediaType = $isVideo ? 'video' : 'image';
                            if (!$isVideo && (str_contains(strtolower($url), '360') || str_contains(strtolower($url), 'panorama'))) {
                                $mediaType = 'panorama';
                            }
                        }
                        
                        $chambre->images()->create([
                            'chemin_image' => $url,
                            'type_media' => $mediaType,
                            'est_principale' => $index === 0
                        ]);
                    }
                }
            }

            // Traiter les fichiers d'images/vidéos
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $storagePath = $file->store('chambres', 'public');
                    $path = config('app.url') . '/storage/' . $storagePath;
                    
                    // Detect media type from file extension
                    $extension = strtolower($file->getClientOriginalExtension());
                    $isVideo = in_array($extension, ['mp4', 'mov', 'avi', 'wmv', 'webm']);
                    
                    // Si aucune image n'est principale (pas d'URL avant), la première est principale
                    $hasPrincipal = $chambre->images()->where('est_principale', true)->exists();
                    
                    $mediaType = $isVideo ? 'video' : 'image';
                    if (!$isVideo && (str_contains(strtolower($file->getClientOriginalName()), '360') || str_contains(strtolower($file->getClientOriginalName()), 'panorama'))) {
                        $mediaType = 'panorama';
                    }

                    $chambre->images()->create([
                        'chemin_image' => $path,
                        'type_media' => $mediaType,
                        'est_principale' => !$hasPrincipal
                    ]);
                }
            }

            return response()->json(['success' => true, 'data' => $chambre->load('images')], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating chambre: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function update(Request $request, $id) {
        try {
            $chambre = Chambre::find($id);
            if (!$chambre) return response()->json(['error' => 'Chambre non trouvée'], 404);

            $validator = Validator::make($request->all(), [
                'numero' => 'string|unique:chambres,numero,'.$id,
                'etage' => 'integer',
                'type_chambre_id' => 'exists:types_chambre,id',
                'statut' => 'in:disponible,occupee,maintenance',
                'image_urls' => 'nullable|array',
                'image_urls.*' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,mov,avi,wmv,webm|max:51200'
            ]);

            if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 400);

            $chambre->update($request->except(['image_urls', 'images', 'image']));

            if ($request->has('image_urls') || $request->hasFile('images')) {
                // Pour la mise à jour, on peut choisir de tout remplacer ou d'ajouter.
                // Ici on remplace tout pour simplifier la gestion des 4 photos.
                $chambre->images()->delete();

                // Traiter les URLs d'images/vidéos
                if ($request->image_urls) {
                    foreach ($request->image_urls as $index => $url) {
                        if ($url) {
                            // Detect media type from URL extension
                            $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));
                            $isVideo = in_array($extension, ['mp4', 'mov', 'avi', 'wmv', 'webm']);
                            
                            $chambre->images()->create([
                                'chemin_image' => $url,
                                'type_media' => $isVideo ? 'video' : 'image',
                                'est_principale' => $index === 0
                            ]);
                        }
                    }
                }

                // Traiter les fichiers d'images/vidéos
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $index => $file) {
                        $storagePath = $file->store('chambres', 'public');
                        $path = config('app.url') . '/storage/' . $storagePath;
                        
                        // Detect media type from file extension
                        $extension = strtolower($file->getClientOriginalExtension());
                        $isVideo = in_array($extension, ['mp4', 'mov', 'avi', 'wmv', 'webm']);
                        
                        $hasPrincipal = $chambre->images()->where('est_principale', true)->exists();
                        
                        $mediaType = $isVideo ? 'video' : 'image';
                        if (!$isVideo && (str_contains(strtolower($file->getClientOriginalName()), '360') || str_contains(strtolower($file->getClientOriginalName()), 'panorama'))) {
                            $mediaType = 'panorama';
                        }

                        $chambre->images()->create([
                            'chemin_image' => $path,
                            'type_media' => $mediaType,
                            'est_principale' => !$hasPrincipal
                        ]);
                    }
                }
            }

            return response()->json(['success' => true, 'data' => $chambre->load('images')]);
        } catch (\Exception $e) {
            \Log::error('Error updating chambre: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'id' => $id
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function destroy($id) {
        try {
            $chambre = Chambre::find($id);
            if (!$chambre) return response()->json(['error' => 'Chambre non trouvée'], 404);
            
            // Vérifier s'il y a des réservations liées
            if ($chambre->reservations()->exists()) {
                return response()->json([
                    'error' => 'Impossible de supprimer cette chambre car elle possède des réservations liées. Veuillez d\'abord supprimer les réservations.'
                ], 422);
            }

            $chambre->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            \Log::error('Error deleting chambre: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la suppression de la chambre.'], 500);
        }
    }
}