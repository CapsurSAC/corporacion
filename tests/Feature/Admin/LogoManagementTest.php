<?php

namespace Tests\Feature\Admin;

use App\Models\Comercio;
use App\Models\Grupo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LogoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_logos_management(): void
    {
        $response = $this->get('/admin/logos');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_logos_management(): void
    {
        $user = User::factory()->create();
        $grupo = Grupo::factory()->create();

        $comercio = Comercio::factory()->create([
            'grupo_id' => $grupo->id,
            'nombre' => 'Test Comercio',
            'slug' => 'test-comercio',
            'logo_modo_claro' => '/logos-comercios/test-claro.png',
            'logo_modo_oscuro' => '/logos-comercios/test-oscuro.png',
        ]);

        $response = $this->actingAs($user)->get("/admin/logos");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/logos/index')
            ->has('comercios', 1)
            ->where('comercios.0.logo_modo_claro', '/logos-comercios/test-claro.png')
            ->where('comercios.0.logo_modo_oscuro', '/logos-comercios/test-oscuro.png')
        );
    }

    public function test_admin_can_update_comercio_logos_with_paths(): void
    {
        $user = User::factory()->create();
        $grupo = Grupo::factory()->create();

        $comercio = Comercio::factory()->create([
            'grupo_id' => $grupo->id,
            'nombre' => 'Test Comercio 2',
            'slug' => 'test-comercio-2',
        ]);

        $response = $this->actingAs($user)->post("/admin/logos/{$comercio->id}", [
            'logo_modo_claro' => '/logos-comercios/nuevo-claro.png',
            'logo_modo_oscuro' => '/logos-comercios/nuevo-oscuro.png',
        ]);

        $response->assertRedirect();
        $comercio->refresh();
        $this->assertEquals('/logos-comercios/nuevo-claro.png', $comercio->logo_modo_claro);
        $this->assertEquals('/logos-comercios/nuevo-oscuro.png', $comercio->logo_modo_oscuro);
    }

    public function test_admin_can_upload_logo_file(): void
    {
        $user = User::factory()->create();
        $grupo = Grupo::factory()->create();

        $comercio = Comercio::factory()->create([
            'grupo_id' => $grupo->id,
            'nombre' => 'Test Upload',
            'slug' => 'test-upload',
        ]);

        $file = UploadedFile::fake()->create('custom-logo.png', 100, 'image/png');

        $response = $this->actingAs($user)->post("/admin/logos/{$comercio->id}", [
            'logo_modo_claro_file' => $file,
        ]);

        $response->assertRedirect();
        $comercio->refresh();
        $this->assertNotNull($comercio->logo_modo_claro);
        $this->assertStringContainsString('/logos-comercios/', $comercio->logo_modo_claro);
    }
}
