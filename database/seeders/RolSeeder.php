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
        Rol::updateOrCreate(
            ['slug' => 'administrador'],
            [
                'nombre' => 'Administrador',
                'descripcion' => 'Acceso total y control de administración del sistema Capsur.',
            ]
        );
    }
}
