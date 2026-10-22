<?php

namespace Tests\Feature\Capacitado;

use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\User;
use App\Services\CapacitadoChatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class CapacitadoChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_capacitado_can_send_a_chat_message_for_an_active_area(): void
    {
        $user = $this->capacitado();

        $this->mock(CapacitadoChatService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('ask')
                ->once()
                ->withArgs(fn (string $area, string $message, array $history) => $area === 'venta'
                    && $message === '¿Cuál es el procedimiento?'
                    && $history === [])
                ->andReturn('Respuesta de prueba');
        });

        $this->actingAs($user)->postJson('/capacitado/chat', [
            'area' => 'venta',
            'message' => '¿Cuál es el procedimiento?',
            'history' => [],
        ])->assertOk()
            ->assertJsonPath('reply', 'Respuesta de prueba')
            ->assertJsonStructure(['reply', 'timestamp']);
    }

    public function test_chat_rejects_unknown_or_inactive_areas(): void
    {
        $this->actingAs($this->capacitado())->postJson('/capacitado/chat', [
            'area' => 'area-inexistente',
            'message' => 'Consulta',
        ])->assertForbidden();
    }

    private function capacitado(): User
    {
        $role = Rol::create(['nombre' => 'CAPACITADO', 'slug' => 'capacitado']);
        $area = TrainingArea::firstOrCreate(['slug' => 'venta'], [
            'name' => 'Venta',
            'color' => '#0c43a3',
            'is_active' => true,
        ]);

        return User::factory()->create(['rol_id' => $role->id, 'training_area_id' => $area->id, 'is_enabled' => true]);
    }
}
