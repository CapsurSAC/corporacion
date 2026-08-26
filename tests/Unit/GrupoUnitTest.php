<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Grupo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GrupoUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_grupo_can_be_instantiated_and_persisted(): void
    {
        $grupo = Grupo::factory()->create([
            'nombre' => 'Grupo Educativo Capsur',
            'slug' => 'grupo-educativo-capsur',
            'activo' => true,
        ]);

        $this->assertDatabaseHas('grupos', [
            'id' => $grupo->id,
            'nombre' => 'Grupo Educativo Capsur',
            'slug' => 'grupo-educativo-capsur',
            'activo' => 1,
        ]);

        $this->assertTrue($grupo->activo);
    }

    public function test_grupo_has_many_comercios(): void
    {
        $grupo = Grupo::factory()->create();
        $comercio1 = Comercio::factory()->create(['grupo_id' => $grupo->id]);
        $comercio2 = Comercio::factory()->create(['grupo_id' => $grupo->id]);

        $this->assertCount(2, $grupo->comercios);
        $this->assertTrue($grupo->comercios->contains($comercio1));
        $this->assertTrue($grupo->comercios->contains($comercio2));
    }

    public function test_grupo_has_many_carreras_through_comercios(): void
    {
        $grupo = Grupo::factory()->create();
        $comercio = Comercio::factory()->create(['grupo_id' => $grupo->id]);
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);

        $this->assertCount(1, $grupo->carreras);
        $this->assertTrue($grupo->carreras->contains($carrera));
    }
}
