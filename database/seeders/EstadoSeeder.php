<?php

namespace Database\Seeders;

use App\Models\Estado;
use Illuminate\Database\Seeder;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            [
                'nombre' => 'No actualizado',
                'clave' => 'no_actualizado',
                'color_hex' => '#d97706',
                'descripcion' => 'Programa pendiente de actualización de contenidos o materiales.',
                'activo' => true,
                'orden' => 1,
            ],
            [
                'nombre' => 'Vendido',
                'clave' => 'vendido',
                'color_hex' => '#2563eb',
                'descripcion' => 'Programa transferido o con matrícula/venta cerrada.',
                'activo' => true,
                'orden' => 2,
            ],
            [
                'nombre' => 'Nuevo',
                'clave' => 'nuevo',
                'color_hex' => '#16a34a',
                'descripcion' => 'Programa recientemente lanzado y activo en el catálogo.',
                'activo' => true,
                'orden' => 3,
            ],
        ];

        foreach ($estados as $estado) {
            Estado::updateOrCreate(
                ['clave' => $estado['clave']],
                $estado
            );
        }
    }
}
