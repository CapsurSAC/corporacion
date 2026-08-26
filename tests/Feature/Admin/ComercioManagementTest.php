<?php

namespace Tests\Feature\Admin;

use App\Models\Comercio;
use App\Models\Grupo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ComercioManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_comercios_index(): void
    {
        $response = $this->get('/default/admin/comercios');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_comercios_index_and_filter(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $grupoA = Grupo::factory()->create(['nombre' => 'Grupo A']);
        $grupoB = Grupo::factory()->create(['nombre' => 'Grupo B']);

        Comercio::factory()->create(['grupo_id' => $grupoA->id, 'nombre' => 'Instituto Alfa']);
        Comercio::factory()->create(['grupo_id' => $grupoB->id, 'nombre' => 'Instituto Beta']);

        // Sin filtro
        $response = $this
            ->actingAs($user)
            ->get(route('admin.comercios.index', ['current_team' => $team->slug]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/comercios/index')
            ->has('comercios', 2)
            ->has('grupos', 2)
        );

        // Con filtro por grupo
        $filterResponse = $this
            ->actingAs($user)
            ->get(route('admin.comercios.index', [
                'current_team' => $team->slug,
                'grupo_id' => $grupoA->id,
            ]));

        $filterResponse->assertOk();
        $filterResponse->assertInertia(fn (Assert $page) => $page
            ->component('admin/comercios/index')
            ->has('comercios', 1)
            ->where('comercios.0.nombre', 'Instituto Alfa')
        );
    }

    public function test_user_can_view_comercio_edit_page(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $comercio = Comercio::factory()->create(['nombre' => 'CECAVA Centro Minero']);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.comercios.edit', [
                'current_team' => $team->slug,
                'comercio' => $comercio->id,
            ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/comercios/edit')
            ->where('comercio.id', $comercio->id)
            ->where('comercio.nombre', 'CECAVA Centro Minero')
        );
    }

    public function test_user_can_create_a_comercio(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
        $grupo = Grupo::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.comercios.store', ['current_team' => $team->slug]), [
                'grupo_id' => $grupo->id,
                'nombre' => 'Escuela Superior de Negocios NEXT',
                'codigo' => 'NEXT',
                'sigla' => 'NEXT',
                'color_hex' => '#78350f',
                'pagina_web' => 'https://nextonline.pe',
                'activo' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comercios', [
            'nombre' => 'Escuela Superior de Negocios NEXT',
            'slug' => 'escuela-superior-de-negocios-next',
            'grupo_id' => $grupo->id,
            'color_hex' => '#78350f',
            'activo' => 1,
        ]);
    }

    public function test_comercio_validation_rejects_invalid_color_and_short_name(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;
        $grupo = Grupo::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.comercios.store', ['current_team' => $team->slug]), [
                'grupo_id' => $grupo->id,
                'nombre' => 'X',
                'color_hex' => 'no-hex-color',
            ]);

        $response->assertSessionHasErrors(['nombre', 'color_hex']);
    }

    public function test_user_can_update_a_comercio(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $comercio = Comercio::factory()->create(['nombre' => 'Nombre Antiguo']);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.comercios.update', [
                'current_team' => $team->slug,
                'comercio' => $comercio->id,
            ]), [
                'grupo_id' => $comercio->grupo_id,
                'nombre' => 'Instituto Renovado 2026',
                'color_hex' => '#0c43a3',
                'canales_youtube' => ['https://youtube.com/@capsur_oficial'],
                'fotos' => ['https://capsur.pe/foto_sede.png'],
                'activo' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comercios', [
            'id' => $comercio->id,
            'nombre' => 'Instituto Renovado 2026',
            'color_hex' => '#0c43a3',
        ]);
    }

    public function test_user_can_delete_a_comercio(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $comercio = Comercio::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.comercios.destroy', [
                'current_team' => $team->slug,
                'comercio' => $comercio->id,
            ]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('comercios', [
            'id' => $comercio->id,
        ]);
    }
}
