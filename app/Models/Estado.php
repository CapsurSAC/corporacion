<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    use HasFactory;

    protected $table = 'estados';

    protected $fillable = [
        'nombre',
        'color_hex',
        'descripcion',
        'activo',
        'orden',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    /**
     * Scope para filtrar únicamente estados activos.
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Especialidades con este estado.
     */
    public function especialidades(): HasMany
    {
        return $this->hasMany(Especialidad::class, 'estado_id');
    }

    /**
     * Diplomados con este estado.
     */
    public function diplomados(): HasMany
    {
        return $this->hasMany(Diplomado::class, 'estado_id');
    }

    /**
     * Cursos con este estado.
     */
    public function cursos(): HasMany
    {
        return $this->hasMany(Curso::class, 'estado_id');
    }
}
