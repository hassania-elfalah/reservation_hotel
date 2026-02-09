<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImageChambre;

class ImageChambreSeeder extends Seeder
{
    public function run(): void
    {
        // Images pour la chambre 101 (ID 1)
        ImageChambre::create([
            'chambre_id' => 1,
            'chemin_image' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000',
            'est_principale' => true
        ]);

        // Images pour la chambre 102 (ID 2)
        ImageChambre::create([
            'chambre_id' => 2,
            'chemin_image' => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000',
            'est_principale' => true
        ]);

        // Images pour la chambre 201 (ID 3)
        ImageChambre::create([
            'chambre_id' => 3,
            'chemin_image' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000',
            'est_principale' => true
        ]);
    }
}
