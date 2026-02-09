<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        Utilisateur::create([
            'nom' => 'Administrateur',
            'email' => 'admin@hotel.com',
            'mot_de_passe' => Hash::make('password'),
            'telephone' => '0600000000',
            'role' => 'admin',
        ]);
    }
}
