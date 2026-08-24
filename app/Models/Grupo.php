<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupos';

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    /**
     * Comercios que pertenecen al grupo.
     */
    public function comercios(): HasMany
    {
        return $this->hasMany(Comercio::class, 'grupo_id');
    }

    /**
     * Carreras que pertenecen a los comercios de este grupo.
     */
    public function carreras(): HasManyThrough
    {
        return $this->hasManyThrough(Carrera::class, Comercio::class, 'grupo_id', 'comercio_id');
    }
}
