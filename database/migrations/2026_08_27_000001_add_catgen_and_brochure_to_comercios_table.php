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
            $table->string('catgen', 500)->nullable()->after('catalogo_url');
            $table->string('brochure_vacaciones_utiles', 500)->nullable()->after('catgen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comercios', function (Blueprint $table) {
            $table->dropColumn(['catgen', 'brochure_vacaciones_utiles']);
        });
    }
};
