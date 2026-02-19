<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClientReservationConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $pdfContent;
    public $settings;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Reservation $reservation, $pdfContent = null, $settings = [])
    {
        $this->reservation = $reservation;
        $this->pdfContent = $pdfContent;
        $this->settings = $settings;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $mail = $this->subject('Confirmation de votre réservation - ' . ($this->settings['hotel_name'] ?? 'Hôtel Palace'))
                    ->view('emails.client_reservation_confirmed');

        if ($this->pdfContent) {
            $mail->attachData($this->pdfContent, 'facture_reservation_' . $this->reservation->id . '.pdf', [
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }
}
