<?php

namespace Tests\Feature\Admin;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CarreraManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_carreras_index(): void
    {
        $response = $this->get('/admin/carreras');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_carreras_index_and_filter(): void
    {
        $user = User::factory()->create();

        $comercioA = Comercio::factory()->create(['nombre' => 'ISTP SIS']);
        $comercioB = Comercio::factory()->create(['nombre' => 'ISTP AVANTI']);

        Carrera::factory()->create(['comercio_id' => $comercioA->id, 'nombre' => 'Desarrollo de Software']);
        Carrera::factory()->create(['comercio_id' => $comercioB->id, 'nombre' => 'Gastronomía']);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.carreras.index', ));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/carreras/index')
            ->has('carreras', 2)
            ->has('comercios', 2)
        );

        $filterResponse = $this
            ->actingAs($user)
            ->get(route('admin.carreras.index', ['comercio_id' => $comercioA->id,
            ]));

        $filterResponse->assertOk();
        $filterResponse->assertInertia(fn (Assert $page) => $page
            ->component('admin/carreras/index')
            ->has('carreras', 1)
            ->where('carreras.0.nombre', 'Desarrollo de Software')
        );
    }

    public function test_user_can_create_a_carrera(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.carreras.store', ), [
                'comercio_id' => $comercio->id,
                'nombre' => 'Administración de Negocios Bancarios y Financieros',
                'url_malla_curricular' => 'https://drive.google.com/malla.pdf',
                'url_declaracion_jurada' => 'https://drive.google.com/dj.pdf',
                'modelo_certificado' => 'https://drive.google.com/cert.pdf',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('carreras', [
            'comercio_id' => $comercio->id,
            'nombre' => 'Administración de Negocios Bancarios y Financieros',
            'url_malla_curricular' => 'https://drive.google.com/malla.pdf',
        ]);
    }

    public function test_carrera_validation_requires_comercio_and_name(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.carreras.store', ), [
                'comercio_id' => '',
                'nombre' => 'A',
            ]);

        $response->assertSessionHasErrors(['comercio_id', 'nombre']);
    }

    public function test_user_can_update_a_carrera(): void
    {
        $user = User::factory()->create();

        $carrera = Carrera::factory()->create(['nombre' => 'Diseño Gráfico']);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.carreras.update', ['carrera' => $carrera->id,
            ]), [
                'comercio_id' => $carrera->comercio_id,
                'nombre' => 'Diseño Digital Publicitario y Web',
                'url_malla_curricular' => 'https://example.com/nueva_malla.pdf',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('carreras', [
            'id' => $carrera->id,
            'nombre' => 'Diseño Digital Publicitario y Web',
        ]);
    }

    public function test_user_can_delete_a_carrera(): void
    {
        $user = User::factory()->create();

        $carrera = Carrera::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.carreras.destroy', ['carrera' => $carrera->id,
            ]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('carreras', [
            'id' => $carrera->id,
        ]);
    }
}
