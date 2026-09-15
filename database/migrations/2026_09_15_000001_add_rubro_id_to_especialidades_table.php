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
        Schema::table('especialidades', function (Blueprint $table) {
            $table->foreignId('rubro_id')
                ->after('carrera_id')
                ->constrained('rubros')
                ->cascadeOnDelete();

            $table->index('rubro_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('especialidades', function (Blueprint $table) {
            $table->dropForeign(['rubro_id']);
            $table->dropColumn('rubro_id');
        });
    }
};
