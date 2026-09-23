<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Curso>
 */
class CursoFactory extends Factory
{
    protected $model = Curso::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = 'Curso de ' . fake()->unique()->jobTitle();

        return [
            'comercio_id' => Comercio::factory(),
            'carrera_id' => null,
            'rubro_id' => null,
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'tipo' => fake()->randomElement(['tradicional', 'especializado']),
            'flyer' => fake()->url(),
            'brochure' => fake()->url(),
            'youtube' => fake()->url(),
            'precio' => 'S/ ' . fake()->numberBetween(100, 450),
            'actualizado_drive' => fake()->url(),
        ];
    }
}
