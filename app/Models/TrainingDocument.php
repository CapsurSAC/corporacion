<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingDocument extends Model
{
    protected $fillable = [
        'training_area_id', 'title', 'original_filename', 'storage_path',
        'mime_type', 'file_size', 'content_hash', 'status', 'version',
        'extraction_error', 'published_at', 'uploaded_by',
    ];

    protected $casts = ['published_at' => 'datetime'];

    public function area(): BelongsTo
    {
        return $this->belongsTo(TrainingArea::class, 'training_area_id');
    }

    public function chunks(): HasMany
    {
        return $this->hasMany(TrainingDocumentChunk::class);
    }
}
