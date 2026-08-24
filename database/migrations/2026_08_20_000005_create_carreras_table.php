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
        Schema::create('carreras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comercio_id')->constrained('comercios')->cascadeOnDelete();
            $table->string('nombre');
            $table->string('slug');
            $table->string('codigo')->nullable();
            $table->string('tipo')->default('carrera'); // carrera, diplomado, curso, taller, especialidad
            $table->string('modalidad')->default('virtual'); // virtual, presencial, semipresencial, asincrono
            $table->string('duracion')->nullable(); // Ej. "3 años", "6 meses", "120 horas"
            $table->text('descripcion')->nullable();
            $table->string('estado')->default('activo'); // activo, inactivo, en_convocatoria
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carreras');
    }
};
