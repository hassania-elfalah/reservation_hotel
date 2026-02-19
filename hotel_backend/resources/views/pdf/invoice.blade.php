<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture Luxury - {{ $reservation->reference }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .luxury-border {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            border: 15px solid #1a1a1a;
            z-index: -1;
        }
        .luxury-line {
            position: fixed;
            top: 20px; left: 20px; right: 20px; bottom: 20px;
            border: 1px solid #D4A017;
            z-index: -1;
        }
        .container {
            padding: 60px;
        }
        .header {
            margin-bottom: 50px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 30px;
        }
        .logo-container {
            float: left;
            width: 40%;
        }
        .logo {
            max-height: 100px;
            max-width: 100%;
        }
        .hotel-info {
            float: right;
            width: 55%;
            text-align: right;
        }
        .hotel-info h1 {
            color: #D4A017;
            margin: 0;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 5px;
            font-weight: 300;
        }
        .hotel-info p {
            margin: 3px 0;
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .invoice-header {
            margin-bottom: 40px;
            text-align: center;
        }
        .invoice-header h2 {
            font-size: 36px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 10px;
            color: #1a1a1a;
            font-weight: 200;
        }
        .invoice-header .ref {
            font-size: 12px;
            color: #D4A017;
            font-weight: bold;
            margin-top: 10px;
            letter-spacing: 3px;
        }
        .grid {
            width: 100%;
            margin-bottom: 50px;
        }
        .grid td {
            vertical-align: top;
            width: 50%;
        }
        .box {
            padding: 20px;
            background: #fdfdfd;
            border: 1px solid #f5f5f5;
        }
        .label {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #D4A017;
            margin-bottom: 15px;
            display: block;
        }
        .value {
            font-size: 14px;
            color: #1a1a1a;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .table th {
            background: #1a1a1a;
            color: #D4A017;
            padding: 20px 15px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .table td {
            padding: 25px 15px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
        }
        .table tr:last-child td {
            border-bottom: none;
        }
        .total-container {
            float: right;
            width: 300px;
        }
        .total-row {
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .total-row .t-label {
            float: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
        }
        .total-row .t-value {
            float: right;
            font-weight: bold;
            font-size: 14px;
        }
        .grand-total {
            background: #1a1a1a;
            color: #D4A017;
            padding: 20px;
            margin-top: 10px;
        }
        .grand-total .t-label {
            color: #D4A017;
            font-size: 14px;
            font-weight: bold;
        }
        .grand-total .t-value {
            font-size: 24px;
        }
        .footer {
            position: fixed;
            bottom: 60px;
            left: 60px;
            right: 60px;
            text-align: center;
            border-top: 1px solid #f0f0f0;
            padding-top: 20px;
        }
        .footer p {
            font-size: 9px;
            color: #999;
            margin: 5px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .signature {
            margin-top: 60px;
            text-align: right;
        }
        .signature-line {
            width: 200px;
            border-bottom: 1px solid #1a1a1a;
            display: inline-block;
            margin-bottom: 10px;
        }
        .signature-text {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #D4A017;
        }
        .clearfix { clear: both; }
    </style>
</head>
<body>
    <div class="luxury-border"></div>
    <div class="luxury-line"></div>

    <div class="container">
        <div class="header">
            <div class="logo-container">
                @if($settings['logo_url'] ?? false)
                    @php
                        $fullPath = public_path(ltrim($settings['logo_url'], '/'));
                        $base64 = '';
                        if (file_exists($fullPath)) {
                            $type = pathinfo($fullPath, PATHINFO_EXTENSION);
                            $data = file_get_contents($fullPath);
                            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                        }
                    @endphp
                    @if($base64)
                        <img src="{{ $base64 }}" class="logo">
                    @else
                        <h1 style="color: #D4A017; margin: 0; font-size: 24px;">{{ $settings['hotel_name'] ?? 'HASSANIA' }}</h1>
                    @endif
                @endif
            </div>
            <div class="hotel-info">
                <h1>{{ $settings['hotel_name'] ?? 'Luxury Hotel' }}</h1>
                <p>{{ $settings['hotel_address'] ?? '' }}</p>
                <p>{{ $settings['hotel_phone'] ?? '' }}</p>
                <p>{{ $settings['hotel_email'] ?? '' }}</p>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="invoice-header">
            <h2>Facture</h2>
            <div class="ref">#{{ $reservation->reference }}</div>
            <p style="font-size: 10px; color: #999; margin-top: 5px;">Date d'émission: {{ date('d/m/Y') }}</p>
        </div>

        <table class="grid">
            <tr>
                <td>
                    <div class="box">
                        <span class="label">Destinataire</span>
                        <div class="value">
                            <strong>{{ $reservation->nom_client }}</strong><br>
                            {{ $reservation->email_client }}<br>
                            {{ $reservation->telephone_client }}
                        </div>
                    </div>
                </td>
                <td style="padding-left: 20px;">
                    <div class="box">
                        <span class="label">Détails du Séjour</span>
                        <div class="value">
                            <strong>{{ $reservation->chambre->typeChambre->nom }}</strong><br>
                            Arrivée: {{ \Carbon\Carbon::parse($reservation->date_arrivee)->format('d/m/Y') }}<br>
                            Départ: {{ \Carbon\Carbon::parse($reservation->date_depart)->format('d/m/Y') }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <table class="table">
            <thead>
                <tr>
                    <th>Description de l'Hébergement</th>
                    <th style="text-align: center;">Nuits</th>
                    <th style="text-align: right;">Prix/Nuit</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong style="color: #D4A017; letter-spacing: 1px; text-transform: uppercase;">Séjour Excellence</strong><br>
                        <span style="color: #666; font-size: 11px;">Chambre #{{ $reservation->chambre->numero }} - {{ $reservation->chambre->typeChambre->nom }}</span>
                    </td>
                    <td style="text-align: center;">
                        {{ \Carbon\Carbon::parse($reservation->date_arrivee)->diffInDays(\Carbon\Carbon::parse($reservation->date_depart)) }}
                    </td>
                    <td style="text-align: right;">
                        {{ number_format($reservation->prix_total / max(1, \Carbon\Carbon::parse($reservation->date_arrivee)->diffInDays(\Carbon\Carbon::parse($reservation->date_depart))), 2) }} MAD
                    </td>
                    <td style="text-align: right; font-weight: bold;">
                        {{ number_format($reservation->prix_total, 2) }} MAD
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="total-container">
            <div class="total-row">
                <span class="t-label">Sous-total</span>
                <span class="t-value">{{ number_format($reservation->prix_total, 2) }} MAD</span>
                <div class="clearfix"></div>
            </div>
            <div class="total-row">
                <span class="t-label">Taxes (0%)</span>
                <span class="t-value">0.00 MAD</span>
                <div class="clearfix"></div>
            </div>
            <div class="grand-total">
                <span class="t-label">Total Général</span>
                <span class="t-value">{{ number_format($reservation->prix_total, 2) }} MAD</span>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="clearfix"></div>

        <div class="signature">
            <div class="signature-line"></div><br>
            <span class="signature-text">Direction {{ $settings['hotel_name'] ?? 'Luxury Hotel' }}</span>
        </div>

        <div class="footer">
            <p>{{ $settings['hotel_name'] ?? 'Luxury Hotel' }} | {{ $settings['hotel_address'] ?? '' }}</p>
            <p>Nous vous remercions de votre confiance. Nous espérons vous revoir très bientôt.</p>
        </div>
    </div>
</body>
</html>
