<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rolAdmin = Rol::where('slug', 'administrador')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@capsur.pe'],
            [
                'name' => 'Administrador Capsur',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'rol_id' => $rolAdmin?->id,
            ]
        );

        // Si ya existía, asegurarse de que tenga el rol de administrador
        if ($admin->rol_id !== $rolAdmin?->id) {
            $admin->update(['rol_id' => $rolAdmin?->id]);
        }

        // Asignar o crear equipo por defecto
        if ($admin->teams()->count() === 0) {
            $team = Team::create([
                'name' => 'Grupo Capsur',
                'slug' => 'grupo-capsur',
                'is_personal' => true,
            ]);

            $team->members()->attach($admin, [
                'role' => \App\Enums\TeamRole::Owner->value,
            ]);

            $admin->update(['current_team_id' => $team->id]);
        }
    }
}

