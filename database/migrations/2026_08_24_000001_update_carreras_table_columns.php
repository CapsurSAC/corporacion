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
            if (! Schema::hasColumn('carreras', 'url_malla_curricular')) {
                $table->string('url_malla_curricular')->nullable()->after('nombre');
            }
            if (! Schema::hasColumn('carreras', 'url_declaracion_jurada')) {
                $table->string('url_declaracion_jurada')->nullable()->after('url_malla_curricular');
            }
            if (! Schema::hasColumn('carreras', 'modelo_certificado')) {
                $table->string('modelo_certificado')->nullable()->after('url_declaracion_jurada');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carreras', function (Blueprint $table) {
            $table->dropColumn([
                'url_malla_curricular',
                'url_declaracion_jurada',
                'modelo_certificado',
            ]);
        });
    }
};
