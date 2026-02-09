<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeChambre;

class TypeChambreSeeder extends Seeder
{
    public function run(): void
    {
        TypeChambre::create([
            'nom' => 'Chambre Simple',
            'description' => 'Une chambre confortable pour une personne.',
            'capacite' => 1,
            'prix_base' => 50.00
        ]);

        TypeChambre::create([
            'nom' => 'Chambre Double',
            'description' => 'Parfait pour les couples.',
            'capacite' => 2,
            'prix_base' => 85.00
        ]);

        TypeChambre::create([
            'nom' => 'Suite Luxueuse',
            'description' => 'Le grand luxe avec vue sur mer.',
            'capacite' => 4,
            'prix_base' => 200.00
        ]);
    }
}