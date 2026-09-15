<?php

namespace Database\Factories;

use App\Models\Rubro;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Rubro>
 */
class RubroFactory extends Factory
{
    protected $model = Rubro::class;

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
            'clave' => Str::slug($nombre, '_') . '_' . fake()->unique()->numberBetween(100, 999),
            'color_hex' => fake()->hexColor(),
            'categoria' => fake()->randomElement(['Modalidad de Formación', 'CECAVA (Rubros Técnicos)', 'MAGISTER (Educación)']),
            'descripcion' => fake()->sentence(),
            'activo' => true,
            'orden' => fake()->numberBetween(1, 20),
        ];
    }
}
