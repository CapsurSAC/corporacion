<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Especialidad;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Especialidad>
 */
class EspecialidadFactory extends Factory
{
    protected $model = Especialidad::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = 'Especialidad en ' . fake()->unique()->jobTitle();

        return [
            'carrera_id' => Carrera::factory(),
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'flyer' => fake()->url(),
            'brochure' => fake()->url(),
            'youtube' => fake()->url(),
            'precio' => 'S/ ' . fake()->numberBetween(300, 950),
            'actualizado_drive' => fake()->url(),
        ];
    }
}
