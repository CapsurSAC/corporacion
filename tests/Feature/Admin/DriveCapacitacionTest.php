<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DriveCapacitacionTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_drive_capacitaciones_admin(): void
    {
        $response = $this->get('/admin/drive-capacitaciones');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_drive_capacitaciones_admin(): void
    {
        $user = User::factory()->create();

        Setting::set('drive_escifor', 'https://drive.google.com/escifor');
        Setting::set('drive_multimarca', 'https://drive.google.com/multimarca');

        $response = $this->actingAs($user)->get("/admin/drive-capacitaciones");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/drive-capacitaciones/index')
            ->where('driveEscifor', 'https://drive.google.com/escifor')
            ->where('driveMultimarca', 'https://drive.google.com/multimarca')
        );
    }

    public function test_admin_can_update_drive_capacitaciones_links(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->put("/admin/drive-capacitaciones", [
            'drive_escifor' => 'https://drive.google.com/folder/escifor-updated',
            'drive_multimarca' => 'https://drive.google.com/folder/multimarca-updated',
        ]);

        $response->assertRedirect();
        $this->assertEquals('https://drive.google.com/folder/escifor-updated', Setting::get('drive_escifor'));
        $this->assertEquals('https://drive.google.com/folder/multimarca-updated', Setting::get('drive_multimarca'));
    }

    public function test_welcome_page_receives_drive_links(): void
    {
        Setting::set('drive_escifor', 'https://drive.google.com/escifor-public');
        Setting::set('drive_multimarca', 'https://drive.google.com/multimarca-public');

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('driveLinks.escifor', 'https://drive.google.com/escifor-public')
            ->where('driveLinks.multimarca', 'https://drive.google.com/multimarca-public')
        );
    }
}
