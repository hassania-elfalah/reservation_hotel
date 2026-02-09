<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chambre;
use App\Models\Reservation;
use App\Models\Utilisateur;

class AdminController extends Controller
{
    public function statistiques()
    {
        return response()->json([
            'total_chambres' => Chambre::count(),
            'chambres_disponibles' => Chambre::where('statut', 'disponible')->count(),
            'total_reservations' => Reservation::count(),
            'reservations_aujourdhui' => Reservation::whereDate('created_at', now()->today())->count(),
            'total_clients' => Utilisateur::where('role', 'client')->count(),
            'revenu_total' => Reservation::where('statut', 'confirmee')->sum('prix_total'),
        ]);
    }
}
