<?php

namespace Tests\Feature;

use App\Models\Comercio;
use App\Models\Grupo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_catalog_page_can_be_rendered(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
        );
    }

    public function test_authenticated_user_can_access_dashboard_with_their_team(): void
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        Grupo::factory()->create();
        Comercio::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('dashboard', ['current_team' => $team->slug]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
        );
    }
}
