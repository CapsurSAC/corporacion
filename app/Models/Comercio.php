<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comercio extends Model
{
    use HasFactory;

    protected $table = 'comercios';

    protected $fillable = [
        'grupo_id',
        'nombre',
        'slug',
        'codigo',
        'sigla',
        'color_hex',
        'pagina_web',
        'plataforma_carrera',
        'certificado_url',
        'resolucion_revalidacion',
        'resolucion_creacion',
        'escale_minedu',
        'link_directo_escale',
        'malla_curricular_url',
        'catalogo_url',
        'como_ingresar_plataforma',
        'reconocimiento_director',
        'seminario',
        'convenio',
        'promocion_vigente',
        'canales_youtube',
        'fotos',
        'custom_attributes',
        'descripcion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'canales_youtube' => 'array',
            'fotos' => 'array',
            'custom_attributes' => 'array',
        ];
    }

    /**
     * Grupo al que pertenece el comercio.
     */
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    /**
     * Carreras y programas ofrecidos por este comercio.
     */
    public function carreras(): HasMany
    {
        return $this->hasMany(Carrera::class, 'comercio_id');
    }

    /**
     * Diplomados ofrecidos por este comercio.
     */
    public function diplomados(): HasMany
    {
        return $this->hasMany(Diplomado::class, 'comercio_id');
    }

    /**
     * Cursos ofrecidos por este comercio.
     */
    public function cursos(): HasMany
    {
        return $this->hasMany(Curso::class, 'comercio_id');
    }
}
