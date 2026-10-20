<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_file_nodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_area_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('training_file_nodes')->cascadeOnDelete();
            $table->enum('type', ['folder', 'file']);
            $table->string('name', 255);
            $table->string('storage_path')->nullable();
            $table->string('mime_type', 180)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['training_area_id', 'parent_id']);
            $table->unique(['training_area_id', 'parent_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_file_nodes');
    }
};
