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
        Schema::create('especialidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')->constrained('carreras')->cascadeOnDelete();
            $table->string('nombre');
            $table->string('slug');
            $table->string('flyer', 500)->nullable();
            $table->string('brochure', 500)->nullable();
            $table->string('youtube', 500)->nullable();
            $table->string('precio', 100)->nullable();
            $table->string('actualizado_drive', 500)->nullable();
            $table->timestamps();

            $table->index('carrera_id');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especialidades');
    }
};
