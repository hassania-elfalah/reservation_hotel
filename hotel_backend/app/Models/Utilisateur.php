<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'telephone',
        'adresse',
        'role',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    /**
     * Get the password for the user.
     * Overriding default 'password' column name.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}
