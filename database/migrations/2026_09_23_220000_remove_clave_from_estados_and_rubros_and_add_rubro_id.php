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
        // 1. Agregar rubro_id a diplomados si no existe
        if (Schema::hasTable('diplomados') && ! Schema::hasColumn('diplomados', 'rubro_id')) {
            Schema::table('diplomados', function (Blueprint $table) {
                $table->foreignId('rubro_id')
                    ->nullable()
                    ->after('carrera_id')
                    ->constrained('rubros')
                    ->nullOnDelete();
            });
        }

        // 2. Agregar rubro_id a cursos si no existe
        if (Schema::hasTable('cursos') && ! Schema::hasColumn('cursos', 'rubro_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->foreignId('rubro_id')
                    ->nullable()
                    ->after('carrera_id')
                    ->constrained('rubros')
                    ->nullOnDelete();
            });
        }

        // 3. Migrar datos existentes de tipo a rubro_id si coinciden antes de eliminar clave
        if (Schema::hasTable('rubros') && Schema::hasColumn('rubros', 'clave')) {
            $rubros = DB::table('rubros')->select('id', 'clave')->get();

            foreach ($rubros as $rubro) {
                if (Schema::hasColumn('diplomados', 'tipo') && Schema::hasColumn('diplomados', 'rubro_id')) {
                    DB::table('diplomados')
                        ->where('tipo', $rubro->clave)
                        ->whereNull('rubro_id')
                        ->update(['rubro_id' => $rubro->id]);
                }

                if (Schema::hasColumn('cursos', 'tipo') && Schema::hasColumn('cursos', 'rubro_id')) {
                    DB::table('cursos')
                        ->where('tipo', $rubro->clave)
                        ->whereNull('rubro_id')
                        ->update(['rubro_id' => $rubro->id]);
                }
            }
        }

        // 4. Eliminar columna clave de estados
        if (Schema::hasTable('estados') && Schema::hasColumn('estados', 'clave')) {
            Schema::table('estados', function (Blueprint $table) {
                $table->dropUnique(['clave']);
                $table->dropColumn('clave');
            });
        }

        // 5. Eliminar columna clave de rubros
        if (Schema::hasTable('rubros') && Schema::hasColumn('rubros', 'clave')) {
            Schema::table('rubros', function (Blueprint $table) {
                $table->dropUnique(['clave']);
                $table->dropColumn('clave');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('estados') && ! Schema::hasColumn('estados', 'clave')) {
            Schema::table('estados', function (Blueprint $table) {
                $table->string('clave', 100)->nullable()->after('nombre');
            });
        }

        if (Schema::hasTable('rubros') && ! Schema::hasColumn('rubros', 'clave')) {
            Schema::table('rubros', function (Blueprint $table) {
                $table->string('clave', 100)->nullable()->after('nombre');
            });
        }

        if (Schema::hasTable('diplomados') && Schema::hasColumn('diplomados', 'rubro_id')) {
            Schema::table('diplomados', function (Blueprint $table) {
                $table->dropForeign(['rubro_id']);
                $table->dropColumn('rubro_id');
            });
        }

        if (Schema::hasTable('cursos') && Schema::hasColumn('cursos', 'rubro_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->dropForeign(['rubro_id']);
                $table->dropColumn('rubro_id');
            });
        }
    }
};
