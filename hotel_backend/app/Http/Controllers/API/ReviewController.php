<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewImage;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Get approved reviews for a specific room.
     */
    public function index($chambreId)
    {
        $reviews = Review::with(['utilisateur:id,nom', 'images'])
            ->where('chambre_id', $chambreId)
            ->where('statut', 'approuve')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    /**
     * Store a new review.
     */
    public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string|min:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $reservation = Reservation::findOrFail($request->reservation_id);

        // Check if user owns the reservation and it's completed
        if ($reservation->client_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($reservation->statut !== 'terminee') {
            return response()->json(['message' => 'Vous ne pouvez laisser un avis que pour un séjour terminé.'], 403);
        }

        // Check if review already exists
        if (Review::where('reservation_id', $request->reservation_id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour cette réservation.'], 422);
        }

        return DB::transaction(function () use ($request, $reservation) {
            $review = Review::create([
                'utilisateur_id' => auth()->id(),
                'chambre_id' => $reservation->chambre_id,
                'reservation_id' => $reservation->id,
                'note' => $request->note,
                'commentaire' => $request->commentaire,
                'statut' => 'en_attente', // Needs moderation
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('reviews', 'public');
                    ReviewImage::create([
                        'review_id' => $review->id,
                        'chemin_image' => Storage::url($path),
                    ]);
                }
            }

            return response()->json([
                'message' => 'Votre avis a été soumis et est en attente de modération.',
                'review' => $review->load('images')
            ], 201);
        });
    }

    /**
     * Admin functions for moderation.
     */
    public function adminIndex()
    {
        $reviews = Review::with(['utilisateur', 'chambre', 'images', 'reservation'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['statut' => 'approuve']);

        return response()->json(['message' => 'Avis approuvé.']);
    }

    public function reject($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['statut' => 'rejete']);

        return response()->json(['message' => 'Avis rejeté.']);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        
        // Delete images from storage
        foreach ($review->images as $image) {
            $path = str_replace('/storage/', '', $image->chemin_image);
            Storage::disk('public')->delete($path);
        }

        $review->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }
}
