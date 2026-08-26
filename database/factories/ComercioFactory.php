<?php

namespace Database\Factories;

use App\Models\Comercio;
use App\Models\Grupo;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Comercio>
 */
class ComercioFactory extends Factory
{
    protected $model = Comercio::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = fake()->unique()->company() . ' Institute';

        return [
            'grupo_id' => Grupo::factory(),
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'codigo' => strtoupper(fake()->lexify('???')),
            'sigla' => strtoupper(fake()->lexify('????')),
            'color_hex' => fake()->hexColor(),
            'pagina_web' => fake()->url(),
            'plataforma_carrera' => fake()->url(),
            'certificado_url' => fake()->url(),
            'resolucion_revalidacion' => 'R.D. ' . fake()->numerify('###-2024'),
            'resolucion_creacion' => 'R.M. ' . fake()->numerify('###-2020'),
            'escale_minedu' => fake()->numerify('######'),
            'link_directo_escale' => fake()->url(),
            'malla_curricular_url' => fake()->url(),
            'catalogo_url' => fake()->url(),
            'como_ingresar_plataforma' => fake()->paragraph(),
            'reconocimiento_director' => fake()->sentence(),
            'seminario' => fake()->sentence(),
            'convenio' => fake()->company(),
            'promocion_vigente' => fake()->sentence(),
            'canales_youtube' => [
                fake()->url(),
            ],
            'fotos' => [
                fake()->imageUrl(),
            ],
            'custom_attributes' => [],
            'descripcion' => fake()->paragraph(),
            'activo' => true,
        ];
    }
}
