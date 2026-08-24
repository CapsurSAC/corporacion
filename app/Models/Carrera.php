<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrera extends Model
{
    use HasFactory;

    protected $table = 'carreras';

    protected $fillable = [
        'comercio_id',
        'nombre',
        'slug',
        'url_malla_curricular',
        'url_declaracion_jurada',
        'modelo_certificado',
        'codigo',
        'tipo',
        'modalidad',
        'duracion',
        'descripcion',
        'resolucion',
        'brochure',
        'flyer',
        'modelo_titulo',
        'estado',
    ];

    /**
     * Comercio al que pertenece la carrera.
     */
    public function comercio(): BelongsTo
    {
        return $this->belongsTo(Comercio::class, 'comercio_id');
    }

    /**
     * Diplomados pertenecientes a esta carrera.
     */
    public function diplomados(): HasMany
    {
        return $this->hasMany(Diplomado::class, 'carrera_id');
    }

    /**
     * Cursos pertenecientes a esta carrera.
     */
    public function cursos(): HasMany
    {
        return $this->hasMany(Curso::class, 'carrera_id');
    }
}
