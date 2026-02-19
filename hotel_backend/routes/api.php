<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ChambreController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\Admin\AdminController;
use App\Http\Controllers\API\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\API\ReviewController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::get('/chambres', [ChambreController::class, 'rechercher']);
Route::get('/chambres/{id}', [ChambreController::class, 'show']);
Route::get('/types-chambre', function() {
    return response()->json(\App\Models\TypeChambre::all());
});
Route::get('/chambres/{id}/reviews', [ReviewController::class, 'index']);

// Paramètres publics
Route::get('/settings', [SettingController::class, 'index']);

// Contact - route publique pour soumettre un message
Route::post('/contact', [ContactController::class, 'store']);

// Chatbot
Route::post('/chatbot', [\App\Http\Controllers\API\ChatbotController::class, 'respond']);

// Route for direct download from email (Signed URL) - Outside auth:sanctum
Route::get('/reservations/{id}/badge/signed', [ReservationController::class, 'downloadBadgeSigned'])
    ->name('reservation.badge.signed')
    ->middleware('signed');

// Protected routes (client)
//Route::middleware('auth:sanctum'), kangolo l Laravel: "Had l-blaṣa matkhallich ay waḥad ydkhul 
//liha, khass daruri ykun dakhul (authenticated) o 3ndu waḥd l-Token ṣaliḥ
Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'updatePassword']);
    
    // Réservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/mes-reservations', [ReservationController::class, 'mesReservations']);
    Route::put('/reservations/{id}/annuler', [ReservationController::class, 'annuler']);
    Route::get('/reservations/{id}/badge', [ReservationController::class, 'downloadBadge']);
    
    // Avis (Reviews)
    Route::post('/reviews', [ReviewController::class, 'store']);
    
    // Admin routes
    Route::middleware('admin')->group(function() {
        Route::apiResource('/admin/chambres', ChambreController::class);
        Route::get('/admin/reservations/{id}/invoice', [AdminReservationController::class, 'downloadInvoice']);
        Route::apiResource('/admin/reservations', AdminReservationController::class);
        Route::get('/admin/statistiques', [AdminController::class, 'statistiques']);
        
        // Paramètres admin
        Route::post('/admin/settings', [SettingController::class, 'update']);
        
        // Gestion des messages de contact
        Route::get('/admin/contacts', [ContactController::class, 'index']);
        Route::get('/admin/contacts/{id}', [ContactController::class, 'show']);
        Route::put('/admin/contacts/{id}/statut', [ContactController::class, 'updateStatut']);
        Route::delete('/admin/contacts/{id}', [ContactController::class, 'destroy']);
        
        // Modération des avis
        Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
        Route::put('/admin/reviews/{id}/approve', [ReviewController::class, 'approve']);
        Route::put('/admin/reviews/{id}/reject', [ReviewController::class, 'reject']);
        Route::delete('/admin/reviews/{id}', [ReviewController::class, 'destroy']);
    });
});

// Route to serve storage files with CORS headers (useful for WebGL/Pannellum)
Route::get('/media/{path}', function ($path) {
    if (Storage::disk('public')->exists($path)) {
        return Storage::disk('public')->response($path);
    }
    abort(404);
})->where('path', '.*');