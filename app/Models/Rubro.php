<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rubro extends Model
{
    use HasFactory;

    protected $table = 'rubros';

    protected $fillable = [
        'nombre',
        'clave',
        'color_hex',
        'categoria',
        'descripcion',
        'activo',
        'orden',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    /**
     * Scope para filtrar únicamente rubros activos.
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Diplomados vinculados a este rubro mediante su clave.
     */
    public function diplomados(): HasMany
    {
        return $this->hasMany(Diplomado::class, 'tipo', 'clave');
    }

    /**
     * Cursos vinculados a este rubro mediante su clave.
     */
    public function cursos(): HasMany
    {
        return $this->hasMany(Curso::class, 'tipo', 'clave');
    }

    /**
     * Especialidades vinculadas a este rubro mediante su ID.
     */
    public function especialidades(): HasMany
    {
        return $this->hasMany(Especialidad::class, 'rubro_id');
    }
}
