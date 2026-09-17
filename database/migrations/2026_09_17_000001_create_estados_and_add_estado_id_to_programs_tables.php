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
        if (! Schema::hasTable('estados')) {
            Schema::create('estados', function (Blueprint $table) {
                $table->id();
                $table->string('nombre', 100);
                $table->string('clave', 100)->unique();
                $table->string('color_hex', 20)->default('#64748b');
                $table->text('descripcion')->nullable();
                $table->boolean('activo')->default(true);
                $table->integer('orden')->default(0);
                $table->timestamps();
            });

            // Insert initial default states safely
            DB::table('estados')->insert([
                [
                    'nombre' => 'No actualizado',
                    'clave' => 'no_actualizado',
                    'color_hex' => '#d97706',
                    'descripcion' => 'Programa pendiente de actualización de contenidos o materiales.',
                    'activo' => true,
                    'orden' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'nombre' => 'Vendido',
                    'clave' => 'vendido',
                    'color_hex' => '#2563eb',
                    'descripcion' => 'Programa transferido o con matrícula/venta cerrada.',
                    'activo' => true,
                    'orden' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'nombre' => 'Nuevo',
                    'clave' => 'nuevo',
                    'color_hex' => '#16a34a',
                    'descripcion' => 'Programa recientemente lanzado y activo en el catálogo.',
                    'activo' => true,
                    'orden' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // Add estado_id to especialidades safely
        if (Schema::hasTable('especialidades') && ! Schema::hasColumn('especialidades', 'estado_id')) {
            Schema::table('especialidades', function (Blueprint $table) {
                $table->foreignId('estado_id')
                    ->nullable()
                    ->after('rubro_id')
                    ->constrained('estados')
                    ->nullOnDelete();
            });
        }

        // Add estado_id to diplomados safely
        if (Schema::hasTable('diplomados') && ! Schema::hasColumn('diplomados', 'estado_id')) {
            Schema::table('diplomados', function (Blueprint $table) {
                $table->foreignId('estado_id')
                    ->nullable()
                    ->after('carrera_id')
                    ->constrained('estados')
                    ->nullOnDelete();
            });
        }

        // Add estado_id to cursos safely
        if (Schema::hasTable('cursos') && ! Schema::hasColumn('cursos', 'estado_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->foreignId('estado_id')
                    ->nullable()
                    ->after('carrera_id')
                    ->constrained('estados')
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('especialidades') && Schema::hasColumn('especialidades', 'estado_id')) {
            Schema::table('especialidades', function (Blueprint $table) {
                $table->dropForeign(['estado_id']);
                $table->dropColumn('estado_id');
            });
        }

        if (Schema::hasTable('diplomados') && Schema::hasColumn('diplomados', 'estado_id')) {
            Schema::table('diplomados', function (Blueprint $table) {
                $table->dropForeign(['estado_id']);
                $table->dropColumn('estado_id');
            });
        }

        if (Schema::hasTable('cursos') && Schema::hasColumn('cursos', 'estado_id')) {
            Schema::table('cursos', function (Blueprint $table) {
                $table->dropForeign(['estado_id']);
                $table->dropColumn('estado_id');
            });
        }

        Schema::dropIfExists('estados');
    }
};
