<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Chambre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminReservationNotification;
use App\Models\Utilisateur;

class ReservationController extends Controller {
    
    // Créer une réservation
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'chambre_id' => 'required|exists:chambres,id',
            'date_arrivee' => 'required|date|after_or_equal:today',
            'date_depart' => 'required|date|after:date_arrivee',
            'nom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        
        // Vérifier disponibilité
        $chambre = Chambre::find($request->chambre_id);
        
        if (!$chambre->estDisponible($request->date_arrivee, $request->date_depart)) {
            return response()->json([
                'error' => 'Chambre non disponible pour ces dates'
            ], 400);
        }
        
        // Calculer prix total
        $nuits = (strtotime($request->date_depart) - strtotime($request->date_arrivee)) / (60*60*24);
        $prixTotal = $chambre->typeChambre->prix_base * $nuits;
        
        // Créer réservation
        $reservation = Reservation::create([
            'reference' => 'RES' . strtoupper(Str::random(10)),
            'client_id' => Auth::id() ?? null,
            'chambre_id' => $request->chambre_id,
            'date_arrivee' => $request->date_arrivee,
            'date_depart' => $request->date_depart,
            'prix_total' => $prixTotal,
            'statut' => 'en_attente',
            'nom_client' => $request->nom,
            'email_client' => $request->email,
            'telephone_client' => $request->telephone
        ]);

        // Mettre à jour le statut de la chambre en 'occupee'
        $chambre->update(['statut' => 'occupee']);

        // Envoyer notification email à l'admin
        try {
            $admins = Utilisateur::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                if ($admin->email) {
                    Mail::to($admin->email)->send(new AdminReservationNotification($reservation));
                }
            }
        } catch (\Exception $e) {
            // On continue même si l'envoi d'email échoue
            // \Log::error('Erreur envoi email admin: ' . $e->getMessage());
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Réservation créée',
            'reservation' => $reservation,
            'reference' => $reservation->reference
        ], 201);
    }
    
    // Annuler réservation
    public function annuler($id) {
        $reservation = Reservation::find($id);
        
        if (!$reservation) {
            return response()->json(['error' => 'Réservation non trouvée'], 404);
        }
        
        if ($reservation->statut === 'annulee') {
            return response()->json(['message' => 'Déjà annulée']);
        }
        
        $reservation->update(['statut' => 'annulee']);
        
        // Remettre la chambre en 'disponible'
        if ($reservation->chambre) {
            $reservation->chambre->update(['statut' => 'disponible']);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée'
        ]);
    }
    
    // Lister réservations d'un client
    public function mesReservations() {
        $reservations = Reservation::where('client_id', Auth::id())
            ->with(['chambre.typeChambre', 'chambre.images'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json(['data' => $reservations]);
    }

    public function downloadBadge($id) {
        $reservation = Reservation::where('id', $id)
            ->where('client_id', Auth::id())
            ->with(['chambre.typeChambre'])
            ->firstOrFail();

        return $this->generateBadgePdf($reservation);
    }

    public function downloadBadgeSigned($id) {
        $reservation = Reservation::where('id', $id)
            ->with(['chambre.typeChambre'])
            ->firstOrFail();

        return $this->generateBadgePdf($reservation);
    }

    private function generateBadgePdf($reservation) {
        if ($reservation->statut !== 'confirmee') {
            return response()->json(['error' => 'Badge disponible uniquement pour les réservations confirmées.'], 403);
        }

        $pdf = Pdf::loadView('pdf.badge', compact('reservation'));
        return $pdf->download('badge_reservation_' . $reservation->reference . '.pdf');
    }
}