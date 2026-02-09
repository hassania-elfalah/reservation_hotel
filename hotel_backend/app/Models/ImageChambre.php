<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageChambre extends Model
{
    use HasFactory;

    protected $table = 'images_chambre';

    protected $fillable = [
        'chambre_id',
        'chemin_image',
        'type_media',
        'est_principale',
    ];

    public function chambre()
    {
        return $this->belongsTo(Chambre::class);
    }
}
