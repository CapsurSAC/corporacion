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
            if (! Schema::hasColumn('diplomados', 'actualizado_drive')) {
                $table->string('actualizado_drive')->nullable()->after('precio');
            }
        });

        Schema::table('cursos', function (Blueprint $table) {
            if (! Schema::hasColumn('cursos', 'actualizado_drive')) {
                $table->string('actualizado_drive')->nullable()->after('precio');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diplomados', function (Blueprint $table) {
            if (Schema::hasColumn('diplomados', 'actualizado_drive')) {
                $table->dropColumn('actualizado_drive');
            }
        });

        Schema::table('cursos', function (Blueprint $table) {
            if (Schema::hasColumn('cursos', 'actualizado_drive')) {
                $table->dropColumn('actualizado_drive');
            }
        });
    }
};
