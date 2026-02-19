<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Setting;

class ChatbotController extends Controller
{
    public function respond(Request $request)
    {
        $userMessage = $request->input('message', '');
        $history     = $request->input('history', []);

        // Fetch hotel settings to build system context
        $settings = Setting::pluck('value', 'key');

        $hotelName      = $settings->get('hotel_name', 'notre hôtel');
        $hotelAddress   = $settings->get('hotel_address', 'adresse non disponible');
        $checkIn        = $settings->get('hotel_check_in', '14h00');
        $checkOut       = $settings->get('hotel_check_out', '12h00');
        $breakfastTime  = $settings->get('hotel_breakfast_time', '07h00 - 10h30');
        $parking        = $settings->get('hotel_parking_available', 'oui');
        $wifi           = $settings->get('hotel_wifi', 'gratuit dans toutes les chambres');
        $phone          = $settings->get('hotel_phone', 'non disponible');
        $email          = $settings->get('hotel_email', 'non disponible');

        $systemPrompt = <<<PROMPT
Tu es un concierge virtuel expert et élégant de l'hôtel "{$hotelName}".
Tu réponds aux clients de façon chaleureuse, professionnelle et concise, principalement en français.
Si le client écrit en darija (dialecte marocain), réponds lui en darija de façon naturelle et amicale.

Voici les informations de l'hôtel que tu dois utiliser :
- Nom de l'hôtel : {$hotelName}
- Adresse : {$hotelAddress}
- Check-in : {$checkIn}
- Check-out : {$checkOut}
- Petit-déjeuner : servi de {$breakfastTime}
- Parking : {$parking}
- Wi-Fi : {$wifi}
- Téléphone : {$phone}
- Email : {$email}

Règles:
1. Réponds toujours brièvement (2-4 phrases max).
2. Utilise des emojis pertinents pour rendre les réponses plus vivantes.
3. Si tu ne connais pas une information précise, invite poliment le client à contacter la réception.
4. Ne dis jamais que tu es une IA ou un robot — tu es le concierge de l'hôtel.
5. Reste toujours dans le contexte hôtelier.
PROMPT;

        // Build conversation messages for the API
        $messages = [['role' => 'system', 'content' => $systemPrompt]];

        // Append conversation history (last 10 exchanges max)
        foreach (array_slice($history, -10) as $h) {
            if (isset($h['role'], $h['content'])) {
                $messages[] = ['role' => $h['role'], 'content' => $h['content']];
            }
        }

        // Add the new user message
        $messages[] = ['role' => 'user', 'content' => $userMessage];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type'  => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'       => 'llama-3.3-70b-versatile',
                'messages'    => $messages,
                'max_tokens'  => 300,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $reply = $response->json('choices.0.message.content');
                return response()->json(['response' => $reply]);
            }

            return response()->json([
                'response' => "Désolé, je rencontre un problème technique. Veuillez contacter notre réception. 🙏"
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'response' => "Désolé, je rencontre un problème technique. Veuillez contacter notre réception. 🙏"
            ], 500);
        }
    }
}
