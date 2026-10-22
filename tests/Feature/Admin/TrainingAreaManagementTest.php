<?php

namespace Tests\Feature\Admin;

use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainingAreaManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_deactivate_an_area(): void
    {
        $area = $this->area();

        $this->actingAs($this->admin())->put("/admin/capacitacion/areas/{$area->id}", [
            'name' => 'Ventas',
            'slug' => 'ventas',
            'color' => '#0c43a3',
            'is_active' => false,
        ])->assertRedirect();

        $this->assertFalse($area->fresh()->is_active);
    }

    public function test_area_with_assigned_users_cannot_be_deleted(): void
    {
        $area = $this->area();
        $role = Rol::create(['nombre' => 'CAPACITADO', 'slug' => 'capacitado']);
        User::factory()->create(['rol_id' => $role->id, 'training_area_id' => $area->id]);

        $this->actingAs($this->admin())
            ->delete("/admin/capacitacion/areas/{$area->id}")
            ->assertSessionHasErrors('area');

        $this->assertDatabaseHas('training_areas', ['id' => $area->id]);
    }

    public function test_area_without_users_can_be_deleted(): void
    {
        $area = $this->area();

        $this->actingAs($this->admin())
            ->delete("/admin/capacitacion/areas/{$area->id}")
            ->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('training_areas', ['id' => $area->id]);
    }

    private function admin(): User
    {
        $role = Rol::firstOrCreate(['slug' => 'admin'], ['nombre' => 'ADMIN']);

        return User::factory()->create(['rol_id' => $role->id, 'is_enabled' => true]);
    }

    private function area(): TrainingArea
    {
        return TrainingArea::firstOrCreate(['slug' => 'ventas'], [
            'name' => 'Ventas',
            'color' => '#0c43a3',
            'is_active' => true,
        ]);
    }
}
