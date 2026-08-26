<?php

namespace Tests\Feature\Admin;

use App\Models\Grupo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GrupoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_grupos_index(): void
    {
        $response = $this->get('/default/admin/grupos');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_grupos_index(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        Grupo::factory()->create(['nombre' => 'Grupo Escifor', 'activo' => true]);
        Grupo::factory()->create(['nombre' => 'Grupo Multimarca', 'activo' => true]);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.grupos.index', ['current_team' => $team->slug]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/grupos/index')
            ->has('grupos', 2)
        );
    }

    public function test_user_can_create_a_grupo(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $response = $this
            ->actingAs($user)
            ->post(route('admin.grupos.store', ['current_team' => $team->slug]), [
                'nombre' => 'Grupo Corporativo Globalex',
                'descripcion' => 'Grupo enfocado en asesoría jurídica y comercio internacional.',
                'activo' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('grupos', [
            'nombre' => 'Grupo Corporativo Globalex',
            'slug' => 'grupo-corporativo-globalex',
            'activo' => 1,
        ]);
    }

    public function test_grupo_creation_requires_valid_data(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        // Nombre muy corto (menos de 3 caracteres)
        $response = $this
            ->actingAs($user)
            ->post(route('admin.grupos.store', ['current_team' => $team->slug]), [
                'nombre' => 'ab',
                'activo' => true,
            ]);

        $response->assertSessionHasErrors('nombre');
    }

    public function test_user_can_update_a_grupo(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $grupo = Grupo::factory()->create([
            'nombre' => 'Grupo Antiguo',
            'activo' => true,
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.grupos.update', ['current_team' => $team->slug, 'grupo' => $grupo->id]), [
                'nombre' => 'Grupo Actualizado',
                'descripcion' => 'Nueva descripción institucional.',
                'activo' => false,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('grupos', [
            'id' => $grupo->id,
            'nombre' => 'Grupo Actualizado',
            'activo' => 0,
        ]);
    }

    public function test_user_can_delete_a_grupo(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $grupo = Grupo::factory()->create(['nombre' => 'Grupo Para Eliminar']);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.grupos.destroy', ['current_team' => $team->slug, 'grupo' => $grupo->id]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('grupos', [
            'id' => $grupo->id,
        ]);
    }
}
