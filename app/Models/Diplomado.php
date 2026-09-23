<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Diplomado extends Model
{
    use HasFactory;

    protected $table = 'diplomados';

    protected $fillable = [
        'comercio_id',
        'carrera_id',
        'rubro_id',
        'estado_id',
        'nombre',
        'slug',
        'tipo',
        'flyer',
        'brochure',
        'youtube',
        'precio',
        'actualizado_drive',
    ];

    protected $appends = ['rubros'];

    /**
     * Accesor para el campo rubros (equivalente a tipo).
     */
    public function getRubrosAttribute(): ?string
    {
        return $this->tipo;
    }

    /**
     * Mutador para el campo rubros.
     */
    public function setRubrosAttribute(?string $value): void
    {
        $this->attributes['tipo'] = $value;
    }

    /**
     * Accesor para rubro en singular.
     */
    public function getRubroAttribute(): ?string
    {
        return $this->tipo;
    }

    /**
     * Mutador para rubro en singular.
     */
    public function setRubroAttribute(?string $value): void
    {
        $this->attributes['tipo'] = $value;
    }

    /**
     * Comercio al que pertenece el diplomado.
     */
    public function comercio(): BelongsTo
    {
        return $this->belongsTo(Comercio::class, 'comercio_id');
    }

    /**
     * Carrera a la que pertenece el diplomado (opcional).
     */
    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class, 'carrera_id');
    }

    /**
     * Rubro al que pertenece el diplomado.
     */
    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'rubro_id');
    }

    /**
     * Estado al que pertenece el diplomado.
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }
}
