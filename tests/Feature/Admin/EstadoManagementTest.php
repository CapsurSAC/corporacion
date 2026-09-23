<?php

namespace Tests\Feature\Admin;

use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Especialidad;
use App\Models\Estado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstadoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_estados_index(): void
    {
        $response = $this->get('/admin/estados');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_estados_index(): void
    {
        $user = User::factory()->create();
        Estado::factory()->count(3)->create();

        $response = $this
            ->actingAs($user)
            ->get('/admin/estados');

        $response->assertOk();
    }

    public function test_authenticated_user_can_create_estado(): void
    {
        $user = User::factory()->create();

        $payload = [
            'nombre' => 'En Revisión Técnica',
            'color_hex' => '#0284c7',
            'descripcion' => 'Programa pendiente de revisión por el comité académico.',
            'activo' => true,
            'orden' => 4,
        ];

        $response = $this
            ->actingAs($user)
            ->post('/admin/estados', $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('estados', [
            'nombre' => 'En Revisión Técnica',
            'color_hex' => '#0284c7',
        ]);
    }

    public function test_authenticated_user_can_update_estado(): void
    {
        $user = User::factory()->create();
        $estado = Estado::factory()->create([
            'nombre' => 'Estado Original',
            'color_hex' => '#16a34a',
        ]);

        $payload = [
            'nombre' => 'Estado Modificado',
            'color_hex' => '#dc2626',
            'descripcion' => 'Descripción actualizada',
            'activo' => false,
            'orden' => 10,
        ];

        $response = $this
            ->actingAs($user)
            ->put("/admin/estados/{$estado->id}", $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('estados', [
            'id' => $estado->id,
            'nombre' => 'Estado Modificado',
            'color_hex' => '#dc2626',
            'activo' => false,
        ]);
    }

    public function test_authenticated_user_can_delete_estado_without_associations(): void
    {
        $user = User::factory()->create();
        $estado = Estado::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.estados.destroy', ['estado' => $estado->id]));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('estados', [
            'id' => $estado->id,
        ]);
    }

    public function test_user_cannot_delete_estado_associated_with_especialidad(): void
    {
        $user = User::factory()->create();
        $estado = Estado::factory()->create();

        Especialidad::factory()->create([
            'estado_id' => $estado->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.estados.destroy', ['estado' => $estado->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('estados', [
            'id' => $estado->id,
        ]);
    }

    public function test_user_cannot_delete_estado_associated_with_curso(): void
    {
        $user = User::factory()->create();
        $estado = Estado::factory()->create();

        Curso::factory()->create([
            'estado_id' => $estado->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.estados.destroy', ['estado' => $estado->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('estados', [
            'id' => $estado->id,
        ]);
    }

    public function test_user_cannot_delete_estado_associated_with_diplomado(): void
    {
        $user = User::factory()->create();
        $estado = Estado::factory()->create();

        Diplomado::factory()->create([
            'estado_id' => $estado->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.estados.destroy', ['estado' => $estado->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('estados', [
            'id' => $estado->id,
        ]);
    }
}
