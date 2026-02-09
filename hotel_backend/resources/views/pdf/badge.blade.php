<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bagde de Réservation - {{ $reservation->reference }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; }
        .badge { width: 350px; border: 2px solid #D4A017; border-radius: 15px; overflow: hidden; margin: 0 auto; }
        .header { background-color: #D4A017; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; background: white; }
        .row { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .label { font-size: 10px; color: #888; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: bold; color: #2c3e50; }
        .footer { background: #f9f9f9; padding: 15px; text-align: center; border-top: 1px dashed #D4A017; }
        .reference { font-family: monospace; font-size: 16px; letter-spacing: 2px; }
        .logo { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="badge">
        <div class="header">
            <div class="logo">HÔTEL HASSANIA</div>
            <div style="font-size: 12px;">BADGE DE RÉSERVATION</div>
        </div>
        <div class="content">
            <div class="row">
                <div class="label">Client</div>
                <div class="value">{{ $reservation->nom_client }}</div>
            </div>
            <div class="row">
                <div class="label">Chambre</div>
                <div class="value">{{ $reservation->chambre->typeChambre->nom ?? 'Standard' }} #{{ $reservation->chambre->numero }}</div>
            </div>
            <div class="row">
                <div class="label">Arrivée</div>
                <div class="value">{{ date('d/m/Y', strtotime($reservation->date_arrivee)) }}</div>
            </div>
            <div class="row">
                <div class="label">Départ</div>
                <div class="value">{{ date('d/m/Y', strtotime($reservation->date_depart)) }}</div>
            </div>
        </div>
        <div class="footer">
            <div class="label">Référence</div>
            <div class="value reference">{{ $reservation->reference }}</div>
            <div style="margin-top: 10px; font-size: 8px; color: #aaa;">Présentez ce badge à la réception lors de votre arrivée.</div>
        </div>
    </div>
</body>
</html>
