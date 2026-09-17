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
        // 1. Agregar columna comercio_id si no existe
        Schema::table('especialidades', function (Blueprint $table) {
            if (! Schema::hasColumn('especialidades', 'comercio_id')) {
                $table->foreignId('comercio_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('comercios')
                    ->cascadeOnDelete();
            }
        });

        // 2. Poblar comercio_id a partir de la carrera existente para mantener integridad
        DB::statement('
            UPDATE especialidades e
            INNER JOIN carreras c ON e.carrera_id = c.id
            SET e.comercio_id = c.comercio_id
            WHERE e.comercio_id IS NULL
        ');

        // 3. Modificar carrera_id para que sea nullable con nullOnDelete
        Schema::table('especialidades', function (Blueprint $table) {
            $table->dropForeign(['carrera_id']);
        });

        Schema::table('especialidades', function (Blueprint $table) {
            $table->unsignedBigInteger('carrera_id')->nullable()->change();
            $table->foreign('carrera_id')
                ->references('id')
                ->on('carreras')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('especialidades', function (Blueprint $table) {
            $table->dropForeign(['carrera_id']);
        });

        Schema::table('especialidades', function (Blueprint $table) {
            $table->unsignedBigInteger('carrera_id')->nullable(false)->change();
            $table->foreign('carrera_id')
                ->references('id')
                ->on('carreras')
                ->cascadeOnDelete();

            if (Schema::hasColumn('especialidades', 'comercio_id')) {
                $table->dropForeign(['comercio_id']);
                $table->dropColumn('comercio_id');
            }
        });
    }
};
