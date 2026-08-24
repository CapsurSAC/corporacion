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
            if (! Schema::hasColumn('diplomados', 'tipo')) {
                $table->string('tipo')->default('generico')->after('slug');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diplomados', function (Blueprint $table) {
            if (Schema::hasColumn('diplomados', 'tipo')) {
                $table->dropColumn('tipo');
            }
        });
    }
};
