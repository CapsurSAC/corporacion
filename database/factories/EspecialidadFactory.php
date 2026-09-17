<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
use App\Models\Rubro;
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
            'comercio_id' => Comercio::factory(),
            'carrera_id' => Carrera::factory(),
            'rubro_id' => Rubro::factory(),
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
