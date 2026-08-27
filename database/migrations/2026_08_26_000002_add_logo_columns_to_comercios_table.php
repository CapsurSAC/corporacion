<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comercios', function (Blueprint $table) {
            $table->string('logo_modo_claro')->nullable()->after('color_hex');
            $table->string('logo_modo_oscuro')->nullable()->after('logo_modo_claro');
        });

        // Población inicial con los logotipos existentes en public/logos-comercios
        $initialLogos = [
            'istp-sis' => [
                'logo_modo_claro' => '/logos-comercios/sis-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/sis-para-fondo-oscuro.png',
            ],
            'istp-avanti' => [
                'logo_modo_claro' => '/logos-comercios/avanti-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/avanti-para-fondo-oscuro.png',
            ],
            'next-online' => [
                'logo_modo_claro' => '/logos-comercios/next-online-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/next-online-para-fondo-oscuro.png',
            ],
            'magister' => [
                'logo_modo_claro' => '/logos-comercios/magister-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/magister-para-fondo-oscuro.png',
            ],
            'cecava' => [
                'logo_modo_claro' => '/logos-comercios/cecava-unico.png',
                'logo_modo_oscuro' => '/logos-comercios/cecava-unico.png',
            ],
            'cecava-min' => [
                'logo_modo_claro' => '/logos-comercios/cecava-min-unico.png',
                'logo_modo_oscuro' => '/logos-comercios/cecava-min-unico.png',
            ],
            'matpel' => [
                'logo_modo_claro' => '/logos-comercios/matpel-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/matpel-para-fondo-oscuro.png',
            ],
            'istp-globalex' => [
                'logo_modo_claro' => '/logos-comercios/globalex-para-fondo-blanco.png',
                'logo_modo_oscuro' => '/logos-comercios/globalex-para-fondo-oscuro.png',
            ],
        ];

        foreach ($initialLogos as $slug => $logos) {
            DB::table('comercios')->where('slug', $slug)->update($logos);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comercios', function (Blueprint $table) {
            $table->dropColumn(['logo_modo_claro', 'logo_modo_oscuro']);
        });
    }
};
