<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Reservation;
$res = Reservation::where('chambre_id', 1)->get();
foreach($res as $r) {
    echo "ID: {$r->id} | Start: {$r->date_arrivee} | End: {$r->date_depart} | Status: {$r->statut}\n";
}
