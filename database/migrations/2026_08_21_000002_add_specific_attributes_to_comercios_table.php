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
        Schema::table('comercios', function (Blueprint $table) {
            $table->string('catalogo_url')->nullable()->after('malla_curricular_url');
            $table->string('como_ingresar_plataforma')->nullable()->after('plataforma_carrera');
            $table->text('promocion_vigente')->nullable()->after('convenio');
            $table->json('custom_attributes')->nullable()->after('fotos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comercios', function (Blueprint $table) {
            $table->dropColumn([
                'catalogo_url',
                'como_ingresar_plataforma',
                'promocion_vigente',
                'custom_attributes',
            ]);
        });
    }
};
