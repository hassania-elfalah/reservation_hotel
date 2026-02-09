<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeChambre extends Model {
    protected $table = 'types_chambre';
    
    protected $fillable = ['nom', 'description', 'capacite', 'prix_base'];
    
    public function chambres() {
        return $this->hasMany(Chambre::class, 'type_chambre_id');
    }
    
    public function tarifsSaisonniers() {
        return $this->hasMany(TarifSaisonnier::class, 'type_chambre_id');
    }
    
    public function offresSpeciales() {
        return $this->hasMany(OffreSpeciale::class, 'type_chambre_id');
    }
}