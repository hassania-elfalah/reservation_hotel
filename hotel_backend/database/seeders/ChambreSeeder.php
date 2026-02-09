<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chambre;

class ChambreSeeder extends Seeder
{
    public function run(): void
    {
        Chambre::create([
            'numero' => '101',
            'etage' => 1,
            'type_chambre_id' => 1, // Chambre Simple
            'statut' => 'disponible'
        ]);

        Chambre::create([
            'numero' => '102',
            'etage' => 1,
            'type_chambre_id' => 2, // Chambre Double
            'statut' => 'disponible'
        ]);

        Chambre::create([
            'numero' => '201',
            'etage' => 2,
            'type_chambre_id' => 3, // Suite Luxueuse
            'statut' => 'disponible'
        ]);
        
        Chambre::create([
            'numero' => '202',
            'etage' => 2,
            'type_chambre_id' => 2, // Chambre Double
            'statut' => 'disponible'
        ]);
    }
}
