<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'hotel_name' => 'Hassania El Falah',
            'hotel_breakfast_time' => '07:30 - 10:30',
            'hotel_parking_available' => 'Oui, parking sécurisé gratuit',
            'hotel_wifi_info' => 'Wi-Fi haut débit disponible gratuitement',
            'hotel_checkin_time' => '14:00',
            'hotel_checkout_time' => '12:00',
            'hotel_address' => 'Boulevard Hassan II, Casablanca, Maroc',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
