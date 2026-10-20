<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_document_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('training_area_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('chunk_index');
            $table->longText('content');
            $table->timestamps();
            $table->unique(['training_document_id', 'chunk_index']);
            $table->index(['training_area_id', 'training_document_id'], 'training_chunks_area_document_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_document_chunks');
    }
};
