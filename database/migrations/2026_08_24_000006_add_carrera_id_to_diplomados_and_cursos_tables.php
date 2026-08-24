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
        Schema::table('diplomados', function (Blueprint $table) {
            if (! Schema::hasColumn('diplomados', 'carrera_id')) {
                $table->foreignId('carrera_id')
                    ->nullable()
                    ->after('comercio_id')
                    ->constrained('carreras')
                    ->nullOnDelete();
            }
        });

        Schema::table('cursos', function (Blueprint $table) {
            if (! Schema::hasColumn('cursos', 'carrera_id')) {
                $table->foreignId('carrera_id')
                    ->nullable()
                    ->after('comercio_id')
                    ->constrained('carreras')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diplomados', function (Blueprint $table) {
            if (Schema::hasColumn('diplomados', 'carrera_id')) {
                $table->dropForeign(['carrera_id']);
                $table->dropColumn('carrera_id');
            }
        });

        Schema::table('cursos', function (Blueprint $table) {
            if (Schema::hasColumn('cursos', 'carrera_id')) {
                $table->dropForeign(['carrera_id']);
                $table->dropColumn('carrera_id');
            }
        });
    }
};
