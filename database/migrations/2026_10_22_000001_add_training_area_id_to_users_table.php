<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('training_area_id')
                ->nullable()
                ->after('rol_id')
                ->constrained('training_areas')
                ->restrictOnDelete();
            $table->index(['rol_id', 'training_area_id']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropForeign(['training_area_id']);
            $table->dropIndex(['rol_id', 'training_area_id']);
            $table->dropColumn('training_area_id');
        });
    }
};