<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'client_id',
        'chambre_id',
        'date_arrivee',
        'date_depart',
        'prix_total',
        'statut',
        'nom_client',
        'email_client',
        'telephone_client',
    ];

    public function chambre()
    {
        return $this->belongsTo(Chambre::class);
    }

    public function client()
    {
        return $this->belongsTo(Utilisateur::class, 'client_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
