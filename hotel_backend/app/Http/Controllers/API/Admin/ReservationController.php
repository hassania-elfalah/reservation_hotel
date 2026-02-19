<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ClientReservationConfirmed;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with(['chambre.typeChambre', 'client'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['data' => $reservations]);
    }

    public function show($id)
    {
        $reservation = Reservation::with(['chambre.typeChambre', 'client'])->find($id);
        if (!$reservation) return response()->json(['error' => 'Réservation non trouvée'], 404);
        return response()->json(['data' => $reservation]);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) return response()->json(['error' => 'Réservation non trouvée'], 404);

        $request->validate([
            'statut' => 'required|in:en_attente,confirmee,annulee,terminee'
        ]);

        $reservation->update(['statut' => $request->statut]);

        if ($request->statut === 'confirmee') {
            try {
                if ($reservation->email_client) {
                    // Recharger la réservation avec les relations nécessaires pour la facture
                    $reservation->load(['chambre.typeChambre', 'client']);
                    
                    // Récupérer les paramètres de l'hôtel
                    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
                    
                    // Générer le PDF
                    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', [
                        'reservation' => $reservation,
                        'settings' => $settings
                    ]);
                    
                    $pdfContent = $pdf->output();

                    Mail::to($reservation->email_client)->send(new ClientReservationConfirmed($reservation, $pdfContent, $settings));
                }
            } catch (\Exception $e) {
                // Log l'erreur si besoin, mais ne pas bloquer la réponse
                \Log::error("Erreur envoi email facture: " . $e->getMessage());
            }
        }
        return response()->json(['success' => true, 'message' => 'Statut mis à jour et facture envoyée']);
    }

    public function downloadInvoice($id)
    {
        $reservation = Reservation::with(['chambre.typeChambre', 'client'])->find($id);
        if (!$reservation) return response()->json(['error' => 'Réservation non trouvée'], 404);

        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', [
            'reservation' => $reservation,
            'settings' => $settings
        ]);

        return $pdf->download('facture_' . $reservation->reference . '.pdf');
    }

    public function destroy($id)
    {
        $reservation = Reservation::find($id);
        if (!$reservation) return response()->json(['error' => 'Réservation non trouvée'], 404);
        $reservation->delete();
        return response()->json(['success' => true, 'message' => 'Réservation supprimée']);
    }
}
