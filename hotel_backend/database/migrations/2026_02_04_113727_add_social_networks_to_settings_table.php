<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert social_networks key with migrated data from old format
        $oldFacebook = DB::table('settings')->where('key', 'social_facebook')->value('value');
        $oldInstagram = DB::table('settings')->where('key', 'social_instagram')->value('value');
        $oldTwitter = DB::table('settings')->where('key', 'social_twitter')->value('value');

        $networks = [];
        if ($oldFacebook) {
            $networks[] = ['id' => '1', 'name' => 'Facebook', 'url' => $oldFacebook];
        }
        if ($oldInstagram) {
            $networks[] = ['id' => '2', 'name' => 'Instagram', 'url' => $oldInstagram];
        }
        if ($oldTwitter) {
            $networks[] = ['id' => '3', 'name' => 'Twitter / X', 'url' => $oldTwitter];
        }

        DB::table('settings')->insert([
            'key' => 'social_networks',
            'value' => json_encode($networks),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'social_networks')->delete();
    }
};
