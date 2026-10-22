<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingArea extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'color', 'bot_name', 'initial_message',
        'ai_instructions', 'is_active', 'sort_order', 'created_by',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function documents(): HasMany
    {
        return $this->hasMany(TrainingDocument::class);
    }

    public function chunks(): HasMany
    {
        return $this->hasMany(TrainingDocumentChunk::class);
    }

    public function fileNodes(): HasMany
    {
        return $this->hasMany(TrainingFileNode::class)->whereNull('parent_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class, 'training_area_id');
    }
}
