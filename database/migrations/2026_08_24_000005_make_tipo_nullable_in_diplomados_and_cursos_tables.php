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
            $table->string('tipo')->nullable()->default(null)->change();
        });

        Schema::table('cursos', function (Blueprint $table) {
            $table->string('tipo')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diplomados', function (Blueprint $table) {
            $table->string('tipo')->nullable(false)->default('generico')->change();
        });

        Schema::table('cursos', function (Blueprint $table) {
            $table->string('tipo')->nullable(false)->default('tradicional')->change();
        });
    }
};
