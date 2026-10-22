<?php

namespace Tests\Feature\Admin;

use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\TrainingFileNode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TrainingFileManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_file_manager(): void
    {
        $this->get('/admin/archivos')->assertRedirect('/login');
    }

    public function test_admin_can_create_nested_folders_and_upload_files(): void
    {
        Storage::fake();
        $admin = $this->admin();
        $area = $this->area();

        $this->actingAs($admin)->post("/admin/archivos/{$area->slug}/folders", [
            'name' => 'Manuales',
        ])->assertRedirect();

        $folder = TrainingFileNode::query()->where('name', 'Manuales')->firstOrFail();

        $this->actingAs($admin)->post("/admin/archivos/{$area->slug}/folders", [
            'name' => 'Procedimientos',
            'parent_id' => $folder->id,
        ])->assertRedirect();

        $subfolder = TrainingFileNode::query()->where('name', 'Procedimientos')->firstOrFail();
        $file = UploadedFile::fake()->create('guia.pdf', 120, 'application/pdf');

        $this->actingAs($admin)->post("/admin/archivos/{$area->slug}/files", [
            'file' => $file,
            'parent_id' => $subfolder->id,
        ])->assertRedirect();

        $uploaded = TrainingFileNode::query()->where('name', 'guia.pdf')->firstOrFail();
        $this->assertSame($area->id, $uploaded->training_area_id);
        $this->assertSame($subfolder->id, $uploaded->parent_id);
        Storage::assertExists($uploaded->storage_path);
    }

    public function test_duplicate_file_names_get_a_numbered_suffix(): void
    {
        Storage::fake();
        $admin = $this->admin();
        $area = $this->area();
        $folder = TrainingFileNode::create(['training_area_id' => $area->id, 'type' => 'folder', 'name' => 'Manuales']);

        foreach (range(1, 2) as $ignored) {
            $this->actingAs($admin)->post("/admin/archivos/{$area->slug}/files", [
                'file' => UploadedFile::fake()->create('guia.pdf', 10, 'application/pdf'),
                'parent_id' => $folder->id,
            ])->assertRedirect();
        }

        $this->assertDatabaseHas('training_file_nodes', ['parent_id' => $folder->id, 'name' => 'guia.pdf']);
        $this->assertDatabaseHas('training_file_nodes', ['parent_id' => $folder->id, 'name' => 'guia (2).pdf']);
    }

    public function test_duplicate_folder_name_returns_a_validation_error(): void
    {
        $admin = $this->admin();
        $area = $this->area();
        $parent = TrainingFileNode::create(['training_area_id' => $area->id, 'type' => 'folder', 'name' => 'Manuales']);
        TrainingFileNode::create(['training_area_id' => $area->id, 'parent_id' => $parent->id, 'type' => 'folder', 'name' => 'Ventas']);

        $this->actingAs($admin)->post("/admin/archivos/{$area->slug}/folders", [
            'name' => 'Ventas',
            'parent_id' => $parent->id,
        ])->assertSessionHasErrors('name');
    }

    public function test_download_restores_extension_for_legacy_file_names(): void
    {
        Storage::fake();
        Storage::put('training-files/ventas/abc123.pdf', 'contenido');
        $admin = $this->admin();
        $area = $this->area();
        $node = TrainingFileNode::create([
            'training_area_id' => $area->id,
            'type' => 'file',
            'name' => 'guia',
            'storage_path' => 'training-files/ventas/abc123.pdf',
        ]);

        $this->actingAs($admin)->get("/admin/archivos/nodes/{$node->id}/download")
            ->assertDownload('guia.pdf');
    }

    public function test_admin_cannot_place_a_node_in_another_area(): void
    {
        $admin = $this->admin();
        $firstArea = $this->area('Ventas');
        $secondArea = $this->area('Área secundaria');
        $folder = TrainingFileNode::create([
            'training_area_id' => $firstArea->id,
            'type' => 'folder',
            'name' => 'Privada',
        ]);

        $this->actingAs($admin)->post("/admin/archivos/{$secondArea->slug}/folders", [
            'name' => 'No autorizada',
            'parent_id' => $folder->id,
        ])->assertNotFound();
    }

    private function admin(): User
    {
        $role = Rol::create(['nombre' => 'ADMIN', 'slug' => 'admin']);

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
