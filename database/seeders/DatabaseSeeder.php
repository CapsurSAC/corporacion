<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolSeeder::class,
            AdminUserSeeder::class,
            GrupoYComercioSeeder::class,
            RubroSeeder::class,
            EstadoSeeder::class,
            CarreraSeeder::class,
            DiplomadoSeeder::class,
            CursoSeeder::class,
            EspecialidadSeeder::class,
        ]);
    }
}

