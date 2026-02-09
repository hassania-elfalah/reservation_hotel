<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Soumettre un message de contact (accessible à tous)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'sujet' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'email' => $request->email,
            'sujet' => $request->sujet,
            'message' => $request->message,
            'statut' => 'nouveau'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => $contact
        ], 201);
    }

    /**
     * Récupérer tous les messages (admin seulement)
     */
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }

    /**
     * Récupérer un message spécifique (admin)
     */
    public function show($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        // Marquer comme lu automatiquement
        if ($contact->statut === 'nouveau') {
            $contact->update(['statut' => 'lu']);
        }

        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    /**
     * Mettre à jour le statut d'un message (admin)
     */
    public function updateStatut(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:nouveau,lu,traite'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $contact->update(['statut' => $request->statut]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'data' => $contact
        ]);
    }

    /**
     * Supprimer un message (admin)
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé'
        ]);
    }
}
