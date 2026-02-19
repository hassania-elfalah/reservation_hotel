<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'utilisateur_id',
        'chambre_id',
        'reservation_id',
        'note',
        'commentaire',
        'statut',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function chambre()
    {
        return $this->belongsTo(Chambre::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function images()
    {
        return $this->hasMany(ReviewImage::class);
    }
}
