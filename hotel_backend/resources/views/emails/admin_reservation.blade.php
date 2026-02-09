<!DOCTYPE html>
<html>
<head>
    <title>Nouvelle Réservation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #2c3e50; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; font-size: 0.8em; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nouvelle demande de réservation reçue !</h1>
        <p>Une nouvelle réservation a été effectuée sur le site.</p>
        
        <h2>Détails de la réservation :</h2>
        <ul>
            <li><strong>Référence :</strong> {{ $reservation->reference }}</li>
            <li><strong>Client :</strong> {{ $reservation->nom_client }}</li>
            <li><strong>Email Client :</strong> {{ $reservation->email_client }}</li>
            <li><strong>Téléphone :</strong> {{ $reservation->telephone_client }}</li>
            <li><strong>Date d'arrivée :</strong> {{ $reservation->date_arrivee }}</li>
            <li><strong>Date de départ :</strong> {{ $reservation->date_depart }}</li>
            <li><strong>ID Chambre :</strong> {{ $reservation->chambre_id }}</li>
            <li><strong>Prix Total :</strong> {{ $reservation->prix_total }} MAD</li>
        </ul>
        
        <div class="footer">
            <p>Connectez-vous au panneau d'administration pour gérer cette réservation.</p>
        </div>
    </div>
</body>
</html>
