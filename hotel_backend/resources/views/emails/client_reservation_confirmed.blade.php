<!DOCTYPE html>
<html>
<head>
    <title>Réservation Confirmée</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #27ae60; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; font-size: 0.8em; color: #777; }
        .button { display: inline-block; padding: 10px 20px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Votre réservation est confirmée !</h1>
        <p>Bonjour {{ $reservation->nom_client }},</p>
        <p>Nous avons le plaisir de vous informer que votre réservation a été validée par notre équipe.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ URL::signedRoute('reservation.badge.signed', ['id' => $reservation->id]) }}" class="button">Télécharger mon Badge de Réservation</a>
        </div>
        
        <h2>Détails de votre séjour :</h2>
        <ul>
            <li><strong>Référence :</strong> {{ $reservation->reference }}</li>
            <li><strong>Date d'arrivée :</strong> {{ $reservation->date_arrivee }}</li>
            <li><strong>Date de départ :</strong> {{ $reservation->date_depart }}</li>
            <li><strong>Prix Total :</strong> {{ $reservation->prix_total }} MAD</li>
        </ul>
        
        <p>Nous sommes impatients de vous accueillir.</p>
        
        <div class="footer">
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </div>
    </div>
</body>
</html>
