<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingDocumentChunk extends Model
{
    protected $fillable = ['training_document_id', 'training_area_id', 'chunk_index', 'content'];

    public function document(): BelongsTo
    {
        return $this->belongsTo(TrainingDocument::class, 'training_document_id');
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(TrainingArea::class, 'training_area_id');
    }
}
