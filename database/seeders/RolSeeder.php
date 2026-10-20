<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Evitar duplicados comprobando tanto el slug como el nombre
        $rolCapacitado = Rol::where('slug', 'capacitado')
            ->orWhere('nombre', 'CAPACITADO')
            ->first();

        if (! $rolCapacitado) {
            Rol::create([
                'nombre' => 'CAPACITADO',
                'slug' => 'capacitado',
                'descripcion' => 'Rol asignado a usuarios capacitados.',
            ]);
        }

        $rolAdmin = Rol::where('slug', 'admin')
            ->orWhere('nombre', 'ADMIN')
            ->first();

        if (! $rolAdmin) {
            Rol::create([
                'nombre' => 'ADMIN',
                'slug' => 'admin',
                'descripcion' => 'Rol de administrador con acceso completo al sistema.',
            ]);
        }
    }
}
