<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('images_chambre', function (Blueprint $table) {
            $table->enum('type_media', ['image', 'video', 'panorama'])->default('image')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images_chambre', function (Blueprint $table) {
            $table->enum('type_media', ['image', 'video'])->default('image')->change();
        });
    }
};
