<?php

namespace Tests\Feature\Admin;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Grupo;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogDeletionGuardTest extends TestCase
{
    use RefreshDatabase;

    public function test_grupo_with_comercios_cannot_be_deleted(): void
    {
        $comercio = Comercio::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.grupos.destroy', ['grupo' => $comercio->grupo_id]))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseHas('grupos', ['id' => $comercio->grupo_id]);
        $this->assertDatabaseHas('comercios', ['id' => $comercio->id]);
    }

    public function test_empty_grupo_can_be_deleted(): void
    {
        $grupo = Grupo::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.grupos.destroy', ['grupo' => $grupo->id]))
            ->assertRedirect()
            ->assertSessionMissing('error');

        $this->assertDatabaseMissing('grupos', ['id' => $grupo->id]);
    }

    public function test_comercio_with_programs_cannot_be_deleted(): void
    {
        $carrera = Carrera::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.comercios.destroy', ['comercio' => $carrera->comercio_id]))
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseHas('comercios', ['id' => $carrera->comercio_id]);
        $this->assertDatabaseHas('carreras', ['id' => $carrera->id]);
    }

    public function test_comercio_without_programs_can_be_deleted(): void
    {
        $comercio = Comercio::factory()->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.comercios.destroy', ['comercio' => $comercio->id]))
            ->assertRedirect()
            ->assertSessionMissing('error');

        $this->assertDatabaseMissing('comercios', ['id' => $comercio->id]);
    }

    private function admin(): User
    {
        $role = Rol::firstOrCreate(['slug' => 'admin'], ['nombre' => 'ADMIN']);

        return User::factory()->create(['rol_id' => $role->id, 'is_enabled' => true]);
    }
}
