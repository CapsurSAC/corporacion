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
            // Sigla & Web / Plataforma
            $table->string('sigla')->nullable()->after('codigo');
            $table->string('pagina_web')->nullable()->after('color_hex');
            $table->string('plataforma_carrera')->nullable()->after('pagina_web');

            // Acreditación y Resoluciones MINEDU
            $table->string('certificado_url')->nullable()->after('plataforma_carrera');
            $table->string('resolucion_revalidacion')->nullable()->after('certificado_url');
            $table->string('resolucion_creacion')->nullable()->after('resolucion_revalidacion');
            $table->string('escale_minedu')->nullable()->after('resolucion_creacion');
            $table->string('link_directo_escale')->nullable()->after('escale_minedu');
            $table->string('malla_curricular_url')->nullable()->after('link_directo_escale');
            $table->string('reconocimiento_director')->nullable()->after('malla_curricular_url');

            // Seminarios, Convenios y Multimedia
            $table->string('seminario')->nullable()->after('reconocimiento_director');
            $table->text('convenio')->nullable()->after('seminario');
            $table->json('canales_youtube')->nullable()->after('convenio');
            $table->json('fotos')->nullable()->after('canales_youtube');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comercios', function (Blueprint $table) {
            $table->dropColumn([
                'sigla',
                'pagina_web',
                'plataforma_carrera',
                'certificado_url',
                'resolucion_revalidacion',
                'resolucion_creacion',
                'escale_minedu',
                'link_directo_escale',
                'malla_curricular_url',
                'reconocimiento_director',
                'seminario',
                'convenio',
                'canales_youtube',
                'fotos',
            ]);
        });
    }
};
