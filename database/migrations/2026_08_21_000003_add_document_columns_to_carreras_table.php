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
        Schema::table('carreras', function (Blueprint $table) {
            $table->string('resolucion')->nullable()->after('descripcion');
            $table->string('brochure')->nullable()->after('resolucion');
            $table->string('flyer')->nullable()->after('brochure');
            $table->string('modelo_titulo')->nullable()->after('flyer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carreras', function (Blueprint $table) {
            $table->dropColumn([
                'resolucion',
                'brochure',
                'flyer',
                'modelo_titulo',
            ]);
        });
    }
};
