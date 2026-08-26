<?php

namespace Database\Factories;

use App\Models\Carrera;
use App\Models\Comercio;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Carrera>
 */
class CarreraFactory extends Factory
{
    protected $model = Carrera::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = fake()->unique()->jobTitle() . ' Profesional';

        return [
            'comercio_id' => Comercio::factory(),
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'url_malla_curricular' => fake()->url(),
            'url_declaracion_jurada' => fake()->url(),
            'modelo_certificado' => fake()->url(),
            'codigo' => strtoupper(fake()->lexify('CAR-###')),
            'tipo' => fake()->randomElement(['profesional', 'tecnica', 'auxiliar']),
            'modalidad' => fake()->randomElement(['Presencial', 'Semipresencial', 'Virtual']),
            'duracion' => '3 años',
            'descripcion' => fake()->paragraph(),
            'resolucion' => 'R.D. ' . fake()->numerify('####-2023'),
            'brochure' => fake()->url(),
            'flyer' => fake()->url(),
            'modelo_titulo' => fake()->url(),
            'estado' => 'Activo',
        ];
    }
}
