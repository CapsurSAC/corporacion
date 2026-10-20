<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_area_id')->constrained()->cascadeOnDelete();
            $table->string('title', 180);
            $table->string('original_filename');
            $table->string('storage_path');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('file_size');
            $table->string('content_hash', 64);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->unsignedInteger('version')->default(1);
            $table->text('extraction_error')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['training_area_id', 'status']);
            $table->unique(['training_area_id', 'content_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_documents');
    }
};
