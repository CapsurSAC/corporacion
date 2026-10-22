<?php

namespace Tests\Feature\Capacitado;

use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainingAreaAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_capacitado_can_access_only_its_assigned_area(): void
    {
        $area = $this->area('Ventas', 'ventas');
        $otherArea = $this->area('Marketing', 'marketing');
        $user = $this->capacitado($area);

        $this->actingAs($user)->get('/capacitado/area/ventas')->assertOk();
        $this->actingAs($user)->get('/capacitado/area/marketing')
            ->assertForbidden()
            ->assertSee('No tienes autorización para acceder a esta área de capacitación.');
    }

    public function test_capacitado_index_redirects_to_its_assigned_area(): void
    {
        $area = $this->area('Ventas', 'ventas');
        $this->area('Marketing', 'marketing');

        $this->actingAs($this->capacitado($area))
            ->get('/capacitado')
            ->assertRedirect('/capacitado/area/ventas');
    }

    public function test_capacitado_with_inactive_area_is_logged_out_instead_of_looping(): void
    {
        $area = $this->area('Ventas', 'ventas');
        $area->update(['is_active' => false]);

        $this->actingAs($this->capacitado($area))
            ->get('/capacitado')
            ->assertRedirect('/')
            ->assertSessionHas('error');

        $this->assertGuest();
        $this->get('/')->assertOk();
    }

    public function test_capacitado_cannot_access_a_fixed_route_for_another_area(): void
    {
        $area = $this->area('Informática', 'informatica');

        $this->actingAs($this->capacitado($area))
            ->get('/capacitado/venta')
            ->assertForbidden()
            ->assertSee('No tienes autorización para acceder a esta área de capacitación.');
    }

    private function capacitado(TrainingArea $area): User
    {
        $role = Rol::create(['nombre' => 'CAPACITADO', 'slug' => 'capacitado']);

        return User::factory()->create([
            'rol_id' => $role->id,
            'training_area_id' => $area->id,
            'is_enabled' => true,
        ]);
    }

    private function area(string $name, string $slug): TrainingArea
    {
        return TrainingArea::firstOrCreate(['slug' => $slug], [
            'name' => $name,
            'color' => '#0c43a3',
            'is_active' => true,
        ]);
    }
}