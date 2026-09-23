<?php

namespace Tests\Feature\Admin;

use App\Models\Comercio;
use App\Models\Diplomado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DiplomadoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_diplomados_index(): void
    {
        $response = $this->get('/admin/diplomados');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_diplomados_index_and_filter_by_tipo(): void
    {
        $user = User::factory()->create();

        $comercio = Comercio::factory()->create();
        $rubroAmbientales = \App\Models\Rubro::factory()->create(['nombre' => 'Ambientales']);
        $rubroMineros = \App\Models\Rubro::factory()->create(['nombre' => 'Mineros']);

        Diplomado::factory()->create([
            'comercio_id' => $comercio->id,
            'nombre' => 'Diplomado en Gestión Ambiental',
            'rubro_id' => $rubroAmbientales->id,
        ]);
        Diplomado::factory()->create([
            'comercio_id' => $comercio->id,
            'nombre' => 'Diplomado en Seguridad Minera',
            'rubro_id' => $rubroMineros->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.diplomados.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/diplomados/index')
            ->has('diplomados', 2)
        );

        $filteredResponse = $this
            ->actingAs($user)
            ->get(route('admin.diplomados.index', ['rubro_id' => $rubroAmbientales->id]));

        $filteredResponse->assertOk();
        $filteredResponse->assertInertia(fn (Assert $page) => $page
            ->component('admin/diplomados/index')
            ->has('diplomados', 1)
            ->where('diplomados.0.nombre', 'Diplomado en Gestión Ambiental')
        );
    }

    public function test_user_can_create_a_diplomado(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.diplomados.store', ), [
                'comercio_id' => $comercio->id,
                'nombre' => 'Diplomado de Especialización en Auditorías ISO 14001',
                'tipo' => 'calidad_isos',
                'precio' => 'S/ 450.00',
                'flyer' => 'https://example.com/flyer.png',
                'brochure' => 'https://example.com/brochure.pdf',
                'youtube' => 'https://youtube.com/watch?v=iso14001',
                'actualizado_drive' => 'https://drive.google.com/folder1',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('diplomados', [
            'comercio_id' => $comercio->id,
            'nombre' => 'Diplomado de Especialización en Auditorías ISO 14001',
            'tipo' => 'calidad_isos',
            'precio' => 'S/ 450.00',
        ]);
    }

    public function test_user_can_update_a_diplomado(): void
    {
        $user = User::factory()->create();

        $diplomado = Diplomado::factory()->create([
            'nombre' => 'Diplomado Básico',
            'precio' => 'S/ 300',
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.diplomados.update', ['diplomado' => $diplomado->id,
            ]), [
                'comercio_id' => $diplomado->comercio_id,
                'nombre' => 'Diplomado Avanzado y Certificado',
                'tipo' => 'osha',
                'precio' => 'S/ 550',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('diplomados', [
            'id' => $diplomado->id,
            'nombre' => 'Diplomado Avanzado y Certificado',
            'precio' => 'S/ 550',
        ]);
    }

    public function test_user_can_delete_a_diplomado(): void
    {
        $user = User::factory()->create();

        $diplomado = Diplomado::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.diplomados.destroy', ['diplomado' => $diplomado->id,
            ]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('diplomados', [
            'id' => $diplomado->id,
        ]);
    }
}
