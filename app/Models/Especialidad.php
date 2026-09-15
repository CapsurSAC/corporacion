<?php

namespace App\Models;

use Database\Factories\EspecialidadFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Especialidad extends Model
{
    /** @use HasFactory<EspecialidadFactory> */
    use HasFactory;

    protected $table = 'especialidades';

    protected $fillable = [
        'carrera_id',
        'rubro_id',
        'nombre',
        'slug',
        'flyer',
        'brochure',
        'youtube',
        'precio',
        'actualizado_drive',
    ];

    /**
     * Carrera a la que pertenece esta especialidad.
     */
    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class, 'carrera_id');
    }

    /**
     * Rubro al que pertenece esta especialidad.
     */
    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'rubro_id');
    }
}
