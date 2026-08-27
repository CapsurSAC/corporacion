<?php

namespace Tests\Feature\Admin;

use App\Models\Comercio;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CursoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_cursos_index(): void
    {
        $response = $this->get('/admin/cursos');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_cursos_index_and_filter(): void
    {
        $user = User::factory()->create();

        $comercio = Comercio::factory()->create();

        Curso::factory()->create([
            'comercio_id' => $comercio->id,
            'nombre' => 'Curso de Materiales Peligrosos MATPEL I',
            'tipo' => 'especializado',
        ]);
        Curso::factory()->create([
            'comercio_id' => $comercio->id,
            'nombre' => 'Taller de Excel Financiero',
            'tipo' => 'tradicional',
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('admin.cursos.index', ));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/cursos/index')
            ->has('cursos', 2)
        );

        $filteredResponse = $this
            ->actingAs($user)
            ->get(route('admin.cursos.index', ['tipo' => 'especializado',
            ]));

        $filteredResponse->assertOk();
        $filteredResponse->assertInertia(fn (Assert $page) => $page
            ->component('admin/cursos/index')
            ->has('cursos', 1)
            ->where('cursos.0.nombre', 'Curso de Materiales Peligrosos MATPEL I')
        );
    }

    public function test_user_can_create_a_curso(): void
    {
        $user = User::factory()->create();
        $comercio = Comercio::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.cursos.store', ), [
                'comercio_id' => $comercio->id,
                'nombre' => 'Curso Especializado en Respuesta a Emergencias Químicas',
                'tipo' => 'especializado',
                'precio' => 'S/ 280.00',
                'flyer' => 'https://example.com/flyer.png',
                'brochure' => 'https://example.com/brochure.pdf',
                'youtube' => 'https://youtube.com/watch?v=matpel',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cursos', [
            'comercio_id' => $comercio->id,
            'nombre' => 'Curso Especializado en Respuesta a Emergencias Químicas',
            'tipo' => 'especializado',
        ]);
    }

    public function test_user_can_update_a_curso(): void
    {
        $user = User::factory()->create();

        $curso = Curso::factory()->create([
            'nombre' => 'Curso Básico de Seguridad',
            'precio' => 'S/ 150',
        ]);

        $response = $this
            ->actingAs($user)
            ->put(route('admin.cursos.update', ['curso' => $curso->id,
            ]), [
                'comercio_id' => $curso->comercio_id,
                'nombre' => 'Curso Intensivo de Seguridad Minera e Industrial',
                'tipo' => 'especializado',
                'precio' => 'S/ 250',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('cursos', [
            'id' => $curso->id,
            'nombre' => 'Curso Intensivo de Seguridad Minera e Industrial',
            'precio' => 'S/ 250',
        ]);
    }

    public function test_user_can_delete_a_curso(): void
    {
        $user = User::factory()->create();

        $curso = Curso::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.cursos.destroy', ['curso' => $curso->id,
            ]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('cursos', [
            'id' => $curso->id,
        ]);
    }
}
