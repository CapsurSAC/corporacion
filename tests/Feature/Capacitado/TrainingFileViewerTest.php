<?php

namespace Tests\Feature\Capacitado;

use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\TrainingFileNode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TrainingFileViewerTest extends TestCase
{
    use RefreshDatabase;

    public function test_capacitado_receives_only_the_selected_area_file_tree(): void
    {
        $capacitado = $this->capacitado();
        $area = $this->area('Ventas');
        $otherArea = $this->area('Área secundaria');

        TrainingFileNode::create(['training_area_id' => $area->id, 'type' => 'folder', 'name' => 'Manuales']);
        TrainingFileNode::create(['training_area_id' => $otherArea->id, 'type' => 'folder', 'name' => 'Privada']);

        $this->actingAs($capacitado)->get("/capacitado/area/{$area->slug}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('capacitado/area')
                ->where('fileNodes.0.name', 'Manuales')
                ->missing('fileNodes.1')
            );
    }

    public function test_capacitado_can_view_and_download_area_file(): void
    {
        Storage::fake();
        $capacitado = $this->capacitado();
        $area = $this->area();
        $path = 'training-files/ventas/manual.txt';
        Storage::put($path, 'contenido del manual');
        $node = TrainingFileNode::create([
            'training_area_id' => $area->id,
            'type' => 'file',
            'name' => 'manual.txt',
            'storage_path' => $path,
            'mime_type' => 'text/plain',
            'file_size' => 20,
        ]);

        $this->actingAs($capacitado)->get("/capacitado/archivos/{$node->id}/view")
            ->assertOk()
            ->assertHeader('content-type', 'text/plain; charset=UTF-8');

        $this->actingAs($capacitado)->get("/capacitado/archivos/{$node->id}/download")
            ->assertDownload('manual.txt');
    }

    public function test_capacitado_cannot_use_admin_file_mutations(): void
    {
        $capacitado = $this->capacitado();
        $area = $this->area();

        $this->actingAs($capacitado)->post("/admin/archivos/{$area->slug}/folders", [
            'name' => 'No autorizada',
        ])->assertRedirect('/capacitado');

        $this->assertDatabaseMissing('training_file_nodes', ['name' => 'No autorizada']);
    }

    private function capacitado(): User
    {
        $role = Rol::create(['nombre' => 'CAPACITADO', 'slug' => 'capacitado']);

        return User::factory()->create(['rol_id' => $role->id, 'is_enabled' => true]);
    }

    private function area(string $name = 'Ventas'): TrainingArea
    {
        return TrainingArea::create([
            'name' => $name,
            'slug' => str($name)->slug(),
            'color' => '#0c43a3',
            'is_active' => true,
        ]);
    }
}
