<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Votre Réservation est Confirmée</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
        .wrapper { width: 100%; background-color: #f9f9f9; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #1a1a1a; padding: 40px; text-align: center; border-bottom: 4px solid #D4A017; }
        .header img { max-height: 70px; margin-bottom: 20px; }
        .header h1 { color: #D4A017; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-weight: 300; }
        .content { padding: 40px; }
        .content h2 { font-size: 20px; font-weight: 600; margin-top: 0; color: #1a1a1a; }
        .content p { font-size: 16px; color: #4a4a4a; margin-bottom: 25px; }
        .details-card { background-color: #fdfdfd; border: 1px solid #f0f0f0; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
        .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
        .details-row:last-child { border-bottom: none; }
        .details-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .details-value { font-weight: 600; color: #1a1a1a; font-size: 14px; }
        .cta-container { text-align: center; margin-top: 20px; }
        .button { display: inline-block; background-color: #D4A017; color: #ffffff !important; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; transition: background-color 0.3s ease; }
        .footer { padding: 40px; text-align: center; color: #999; font-size: 12px; }
        .social-links { margin-bottom: 20px; }
        .social-links a { margin: 0 10px; color: #D4A017; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                @if($settings['logo_url'] ?? false)
                    @php
                        $logoPath = public_path(ltrim($settings['logo_url'], '/'));
                    @endphp
                    @if(file_exists($logoPath))
                        <img src="{{ $message->embed($logoPath) }}" alt="{{ $settings['hotel_name'] ?? 'Hotel' }}">
                    @else
                        <h1 style="color: #D4A017; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-weight: 300;">{{ $settings['hotel_name'] ?? 'HOUSE HOME' }}</h1>
                    @endif
                @endif
                <h1>Confirmation de Séjour</h1>
            </div>
            
            <div class="content">
                <h2>Cher(e) {{ $reservation->nom_client }},</h2>
                <p>C'est avec un immense plaisir que nous vous confirmons votre réservation au sein de l'établissement <strong>{{ $settings['hotel_name'] ?? "notre établissement" }}</strong>.</p>
                
                <p>Nous avons attaché à cet email votre facture officielle au format PDF pour votre convenance.</p>
                
                <div class="details-card">
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;">
                        <span style="color: #D4A017; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Récapitulatif de votre séjour</span>
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 8px 0; font-size: 12px; color: #999; text-transform: uppercase;">Référence</td>
                            <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">#{{ $reservation->id }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 12px; color: #999; text-transform: uppercase;">Arrivée</td>
                            <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">{{ \Carbon\Carbon::parse($reservation->date_arrivee)->format('d F Y') }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 12px; color: #999; text-transform: uppercase;">Départ</td>
                            <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">{{ \Carbon\Carbon::parse($reservation->date_depart)->format('d F Y') }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-size: 12px; color: #999; text-transform: uppercase;">Chambre</td>
                            <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">{{ $reservation->chambre->typeChambre->nom }}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="cta-container">
                    <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/reservations" class="button">Gérer ma réservation</a>
                </div>
                
                <p style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 25px; font-style: italic; font-size: 14px; text-align: center;">
                    "Nous attendons avec impatience l'honneur de vous servir."
                </p>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    @if($settings['social_facebook'] ?? false)<a href="{{ $settings['social_facebook'] }}">FB</a>@endif
                    @if($settings['social_instagram'] ?? false)<a href="{{ $settings['social_instagram'] }}">IG</a>@endif
                </div>
                <p>© {{ date('Y') }} {{ $settings['hotel_name'] ?? 'Hôtel Excellence' }}. Tous droits réservés.</p>
                <p>{{ $settings['hotel_address'] ?? '' }}</p>
            </div>
        </div>
    </div>
</body>
</html>
