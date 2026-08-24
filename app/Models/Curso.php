<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Curso extends Model
{
    use HasFactory;

    protected $table = 'cursos';

    protected $fillable = [
        'comercio_id',
        'carrera_id',
        'nombre',
        'slug',
        'tipo',
        'flyer',
        'brochure',
        'youtube',
        'precio',
        'actualizado_drive',
    ];

    /**
     * Comercio al que pertenece el curso.
     */
    public function comercio(): BelongsTo
    {
        return $this->belongsTo(Comercio::class, 'comercio_id');
    }

    /**
     * Carrera a la que pertenece el curso (opcional).
     */
    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class, 'carrera_id');
    }
}
