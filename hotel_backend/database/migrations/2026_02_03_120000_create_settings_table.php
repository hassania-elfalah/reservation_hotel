<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('settings');
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default values
        $defaults = [
            ['key' => 'hotel_name', 'value' => 'Hôtel Excellence'],
            ['key' => 'hotel_address', 'value' => "123 Avenue de l'Excellence, Marrakech 40000"],
            ['key' => 'hotel_phone', 'value' => '+212 5 22 00 00 00'],
            ['key' => 'hotel_email', 'value' => 'contact@hotel-excellence.com'],
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/hotelexcellence'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/hotelexcellence'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/hotelexcellence'],
        ];

        foreach ($defaults as $default) {
            \Illuminate\Support\Facades\DB::table('settings')->insert($default);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
