<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chambre;
use App\Models\Reservation;
use App\Models\Utilisateur;
use App\Models\Review;

class AdminController extends Controller
{
    public function statistiques()
    {
        // Monthly revenue for the last 6 months
        $revenue_monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->translatedFormat('M');
            $year = $date->year;
            $monthNum = $date->month;

            $revenue = Reservation::whereIn('statut', ['confirmee', 'terminee'])
                ->whereYear('date_arrivee', $year)
                ->whereMonth('date_arrivee', $monthNum)
                ->sum('prix_total');

            $revenue_monthly[] = [
                'name' => $monthName,
                'revenue' => (float)$revenue
            ];
        }

        // Weekly revenue for the last 7 days
        $revenue_weekly = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayName = $date->translatedFormat('D');
            
            $revenue = Reservation::whereIn('statut', ['confirmee', 'terminee'])
                ->whereDate('date_arrivee', $date->toDateString())
                ->sum('prix_total');

            $revenue_weekly[] = [
                'name' => $dayName,
                'revenue' => (float)$revenue
            ];
        }

        // Recent activities
        $recent_activities = Reservation::with(['client', 'chambre.typeChambre'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($res) {
                $name = $res->client ? $res->client->nom : $res->nom_client;
                return [
                    'id' => $res->id,
                    'type' => 'réservation',
                    'client' => $name,
                    'chambre' => $res->chambre->numero ?? 'N/A',
                    'date' => $res->created_at->diffForHumans(),
                    'initials' => strtoupper(substr($name, 0, 2))
                ];
            });

        return response()->json([
            'total_chambres' => Chambre::count(),
            'chambres_disponibles' => Chambre::where('statut', 'disponible')->count(),
            'total_reservations' => Reservation::count(),
            'reservations_aujourdhui' => Reservation::whereDate('created_at', now()->today())->count(),
            'total_clients' => Utilisateur::where('role', 'client')->count(),
            'revenu_total' => Reservation::whereIn('statut', ['confirmee', 'terminee'])->sum('prix_total'),
            'avis_en_attente' => Review::where('statut', 'en_attente')->count(),
            'revenue_monthly' => $revenue_monthly,
            'revenue_weekly' => $revenue_weekly,
            'recent_activities' => $recent_activities
        ]);
    }
}
