<?php

namespace Database\Factories;

use App\Models\Estado;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Estado>
 */
class EstadoFactory extends Factory
{
    protected $model = Estado::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = fake()->unique()->words(2, true);

        return [
            'nombre' => ucfirst($nombre),
            'color_hex' => fake()->hexColor(),
            'descripcion' => fake()->sentence(),
            'activo' => true,
            'orden' => fake()->numberBetween(1, 20),
        ];
    }
}
