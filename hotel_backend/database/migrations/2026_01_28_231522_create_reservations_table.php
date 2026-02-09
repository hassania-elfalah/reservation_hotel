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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreignId('chambre_id')->constrained('chambres');
            $table->date('date_arrivee');
            $table->date('date_depart');
            $table->decimal('prix_total', 10, 2);
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee','terminee'])->default('en_attente');
            $table->string('nom_client');
            $table->string('email_client');
            $table->string('telephone_client');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
