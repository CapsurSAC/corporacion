<?php

namespace Tests\Feature\Admin;

use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Especialidad;
use App\Models\Rubro;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RubroManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_rubros_index(): void
    {
        $response = $this->get('/admin/rubros');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_delete_rubro_without_associations(): void
    {
        $user = User::factory()->create();
        $rubro = Rubro::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.rubros.destroy', ['rubro' => $rubro->id]));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('rubros', [
            'id' => $rubro->id,
        ]);
    }

    public function test_user_cannot_delete_rubro_associated_with_especialidad(): void
    {
        $user = User::factory()->create();
        $rubro = Rubro::factory()->create();

        Especialidad::factory()->create([
            'rubro_id' => $rubro->id,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.rubros.destroy', ['rubro' => $rubro->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('rubros', [
            'id' => $rubro->id,
        ]);
    }

    public function test_user_cannot_delete_rubro_associated_with_curso(): void
    {
        $user = User::factory()->create();
        $rubro = Rubro::factory()->create();

        Curso::factory()->create([
            'tipo' => $rubro->clave,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.rubros.destroy', ['rubro' => $rubro->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('rubros', [
            'id' => $rubro->id,
        ]);
    }

    public function test_user_cannot_delete_rubro_associated_with_diplomado(): void
    {
        $user = User::factory()->create();
        $rubro = Rubro::factory()->create();

        Diplomado::factory()->create([
            'tipo' => $rubro->clave,
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('admin.rubros.destroy', ['rubro' => $rubro->id]));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('rubros', [
            'id' => $rubro->id,
        ]);
    }
}
