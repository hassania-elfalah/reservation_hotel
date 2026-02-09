<?php
use App\Models\ImageChambre;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(ImageChambre::all() as $img) {
    echo "ID: {$img->id} | Path: {$img->chemin_image}\n";
}
