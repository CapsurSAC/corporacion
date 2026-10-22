<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingFileNode extends Model
{
    protected $fillable = [
        'training_area_id', 'parent_id', 'type', 'name', 'storage_path',
        'mime_type', 'file_size', 'created_by',
    ];

    protected $casts = ['file_size' => 'integer'];

    public function area(): BelongsTo
    {
        return $this->belongsTo(TrainingArea::class, 'training_area_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('type')->orderBy('name');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Nombre con el que se descarga el archivo. Los registros antiguos se
     * guardaban sin extensión, así que se recupera desde el archivo almacenado.
     */
    public function downloadName(): string
    {
        if (pathinfo($this->name, PATHINFO_EXTENSION) !== '' || ! $this->storage_path) {
            return $this->name;
        }

        $extension = pathinfo($this->storage_path, PATHINFO_EXTENSION);

        return $extension !== '' ? "{$this->name}.{$extension}" : $this->name;
    }
}
