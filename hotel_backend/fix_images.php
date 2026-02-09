<?php
use App\Models\ImageChambre;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$all = ImageChambre::all();
foreach($all as $img) {
    $old = $img->chemin_image;
    // Fix common issues
    $new = str_replace('http://localhost/storage', 'http://127.0.0.1:8000/storage', $old);
    
    if($old !== $new) {
        $img->chemin_image = $new;
        $img->save();
        echo "Changed ID {$img->id}: $old -> $new\n";
    }
}
echo "Total processed: " . count($all) . "\n";
