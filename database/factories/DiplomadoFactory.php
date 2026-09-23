<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Diplomado;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Diplomado>
 */
class DiplomadoFactory extends Factory
{
    protected $model = Diplomado::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = 'Diplomado en ' . fake()->unique()->jobTitle();

        return [
            'comercio_id' => Comercio::factory(),
            'carrera_id' => null,
            'rubro_id' => null,
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'tipo' => fake()->randomElement(['ambientales', 'mineros', 'calidad_isos', 'osha', 'administracion', 'generico']),
            'flyer' => fake()->url(),
            'brochure' => fake()->url(),
            'youtube' => fake()->url(),
            'precio' => 'S/ ' . fake()->numberBetween(250, 800),
            'actualizado_drive' => fake()->url(),
        ];
    }
}
