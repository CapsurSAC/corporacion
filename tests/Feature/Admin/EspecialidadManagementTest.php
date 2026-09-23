<?php

namespace Tests\Feature\Admin;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
use App\Models\Rubro;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EspecialidadManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_especialidades_index(): void
    {
        $response = $this->get('/admin/especialidades');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_especialidades_index_and_filter(): void
    {
        $user = User::factory()->create();

        $carrera1 = Carrera::factory()->create(['nombre' => 'Desarrollo de Software']);
        $carrera2 = Carrera::factory()->create(['nombre' => 'Guía Oficial de Turismo']);

        $rubroTech = Rubro::factory()->create(['nombre' => 'Tecnología']);
        $rubroTurismo = Rubro::factory()->create(['nombre' => 'Turismo']);

        Especialidad::factory()->create([
            'carrera_id' => $carrera1->id,
            'rubro_id' => $rubroTech->id,
            'nombre' => 'Especialidad en Cloud Computing',
        ]);
        Especialidad::factory()->create([
            'carrera_id' => $carrera2->id,
            'rubro_id' => $rubroTurismo->id,
            'nombre' => 'Especialidad en Ecoturismo Andino',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.especialidades.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/especialidades/index')
            ->has('especialidades', 2)
            ->has('carreras')
            ->has('rubros')
            ->has('comercios')
        );

        // Filtrar por carrera
        $filteredByCarrera = $this
            ->actingAs($user)
            ->get(route('admin.especialidades.index', ['carrera_id' => $carrera1->id]));

        $filteredByCarrera->assertOk();
        $filteredByCarrera->assertInertia(fn (Assert $page) => $page
            ->component('admin/especialidades/index')
            ->has('especialidades', 1)
            ->where('especialidades.0.nombre', 'Especialidad en Cloud Computing')
        );

        // Filtrar por rubro
        $filteredByRubro = $this
            ->actingAs($user)
            ->get(route('admin.especialidades.index', ['rubro_id' => $rubroTurismo->id]));

        $filteredByRubro->assertOk();
        $filteredByRubro->assertInertia(fn (Assert $page) => $page
            ->component('admin/especialidades/index')
            ->has('especialidades', 1)
            ->where('especialidades.0.nombre', 'Especialidad en Ecoturismo Andino')
        );
    }

    public function test_authenticated_user_can_create_especialidad(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();
        $carrera = Carrera::factory()->create();
        $rubro = Rubro::factory()->create();

        $data = [
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera->id,
            'rubro_id' => $rubro->id,
            'nombre' => 'Especialidad en Inteligencia Artificial y Datos',
            'precio' => 'S/ 550',
            'flyer' => 'https://example.com/flyer-ia.jpg',
            'brochure' => 'https://example.com/brochure-ia.pdf',
            'youtube' => 'https://youtube.com/watch?v=12345',
            'actualizado_drive' => 'https://drive.google.com/drive/folders/ia',
        ];

        $response = $this
            ->actingAs($user)
            ->post(route('admin.especialidades.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('especialidades', [
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera->id,
            'rubro_id' => $rubro->id,
            'nombre' => 'Especialidad en Inteligencia Artificial y Datos',
            'slug' => 'especialidad-en-inteligencia-artificial-y-datos',
            'precio' => 'S/ 550',
        ]);
    }

    public function test_authenticated_user_can_create_especialidad_libre_without_rubro(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();

        $data = [
            'comercio_id' => $comercio->id,
            'carrera_id' => null,
            'rubro_id' => null,
            'nombre' => 'Especialidad Libre Sin Categoria',
            'precio' => 'S/ 350',
        ];

        $response = $this
            ->actingAs($user)
            ->post(route('admin.especialidades.store'), $data);

        $response->assertRedirect();
        $this->assertDatabaseHas('especialidades', [
            'comercio_id' => $comercio->id,
            'carrera_id' => null,
            'rubro_id' => null,
            'nombre' => 'Especialidad Libre Sin Categoria',
        ]);
    }

    public function test_especialidad_requires_nombre_and_comercio_id(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.especialidades.store'), [
                'carrera_id' => null,
                'rubro_id' => null,
            ]);

        $response->assertSessionHasErrors(['nombre', 'comercio_id']);
    }

    public function test_authenticated_user_can_update_especialidad(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();
        $carrera1 = Carrera::factory()->create();
        $carrera2 = Carrera::factory()->create();
        $rubro1 = Rubro::factory()->create();
        $rubro2 = Rubro::factory()->create();

        $especialidad = Especialidad::factory()->create([
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera1->id,
            'rubro_id' => $rubro1->id,
            'nombre' => 'Nombre Antiguo',
            'precio' => 'S/ 400',
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.especialidades.update', $especialidad), [
                'comercio_id' => $comercio->id,
                'carrera_id' => $carrera2->id,
                'rubro_id' => $rubro2->id,
                'nombre' => 'Nombre Actualizado de Especialidad',
                'precio' => 'S/ 600',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('especialidades', [
            'id' => $especialidad->id,
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera2->id,
            'rubro_id' => $rubro2->id,
            'nombre' => 'Nombre Actualizado de Especialidad',
            'slug' => 'nombre-actualizado-de-especialidad',
            'precio' => 'S/ 600',
        ]);
    }

    public function test_authenticated_user_can_update_especialidad_to_libre(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();
        $rubro = Rubro::factory()->create();

        $especialidad = Especialidad::factory()->create([
            'comercio_id' => $comercio->id,
            'rubro_id' => $rubro->id,
            'nombre' => 'Especialidad con Rubro',
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.especialidades.update', $especialidad), [
                'comercio_id' => $comercio->id,
                'carrera_id' => null,
                'rubro_id' => null,
                'nombre' => 'Especialidad ahora Libre',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('especialidades', [
            'id' => $especialidad->id,
            'rubro_id' => null,
            'nombre' => 'Especialidad ahora Libre',
        ]);
    }

    public function test_authenticated_user_can_delete_especialidad(): void
    {
        $user = User::factory()->create();
        $especialidad = Especialidad::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.especialidades.destroy', $especialidad));

        $response->assertRedirect();
        $this->assertDatabaseMissing('especialidades', [
            'id' => $especialidad->id,
        ]);
    }
}
