<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chambre extends Model {
    protected $fillable = ['numero', 'etage', 'type_chambre_id', 'statut'];
    
    protected $casts = [
        'statut' => 'string'
    ];
    
    public function typeChambre() {
        return $this->belongsTo(TypeChambre::class, 'type_chambre_id');
    }
    
    public function reservations() {
        return $this->hasMany(Reservation::class);
    }
    
    public function images() {
        return $this->hasMany(ImageChambre::class);
    }
    
    // Vérifier disponibilité
    public function estDisponible($dateDebut, $dateFin) {
        return !$this->reservations()
            ->where(function($query) use ($dateDebut, $dateFin) {
                $query->whereBetween('date_arrivee', [$dateDebut, $dateFin])
                      ->orWhereBetween('date_depart', [$dateDebut, $dateFin])
                      ->orWhere(function($q) use ($dateDebut, $dateFin) {
                          $q->where('date_arrivee', '<', $dateDebut)
                            ->where('date_depart', '>', $dateFin);
                      });
            })
            ->whereIn('statut', ['confirmee', 'en_attente'])
            ->exists();
    }
}