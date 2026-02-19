<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 150px; }
        .content { color: #333333; line-height: 1.6; }
        .btn { display: inline-block; padding: 15px 30px; background-color: #D4A017; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .footer { margin-top: 40px; text-align: center; color: #999999; font-size: 12px; }
        .code { font-size: 24px; font-weight: bold; color: #D4A017; background: #fdf8e6; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 20px 0; border: 1px dashed #D4A017; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @php
                if(!isset($settings)) {
                    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
                }
                $logoPath = isset($settings['logo_url']) ? public_path(ltrim($settings['logo_url'], '/')) : null;
            @endphp
            @if($logoPath && file_exists($logoPath))
                <img src="{{ $message->embed($logoPath) }}" alt="{{ $settings['hotel_name'] ?? 'Hotel' }}" style="max-width: 150px;">
            @else
                <h1 style="color: #D4A017; margin: 0; text-transform: uppercase; letter-spacing: 2px;">{{ $settings['hotel_name'] ?? 'HOUSE HOME' }}</h1>
            @endif
        </div>
        <div class="content">
            <h2>Bonjour {{ $user->nom }},</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte House Hotel.</p>
            <p>Voici votre nouveau mot de passe temporaire :</p>
            <div style="text-align: center;">
                <span class="code">{{ $tempPassword }}</span>
            </div>
            <p>Veuillez vous connecter avec ce mot de passe et le modifier immédiatement dans votre profil pour plus de sécurité.</p>
            <div style="text-align: center;">
                <a href="{{ $loginUrl }}" class="btn">Me connecter</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} House Hotel. Tous droits réservés.</p>
            <p>Si vous n'avez pas demandé ce changement, veuillez ignorer cet e-mail.</p>
        </div>
    </div>
</body>
</html>
