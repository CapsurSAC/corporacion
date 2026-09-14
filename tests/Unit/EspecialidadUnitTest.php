<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EspecialidadUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_especialidad_belongs_to_carrera(): void
    {
        $carrera = Carrera::factory()->create(['nombre' => 'Desarrollo de Sistemas de Información']);
        $especialidad = Especialidad::factory()->create([
            'carrera_id' => $carrera->id,
            'nombre' => 'Especialidad en Cloud & DevOps',
        ]);

        $this->assertInstanceOf(Carrera::class, $especialidad->carrera);
        $this->assertEquals($carrera->id, $especialidad->carrera->id);
        $this->assertEquals('Desarrollo de Sistemas de Información', $especialidad->carrera->nombre);
    }

    public function test_carrera_can_have_zero_to_many_especialidades(): void
    {
        // Caso 1: Carrera con 0 especialidades
        $carreraSinEsp = Carrera::factory()->create();
        $this->assertCount(0, $carreraSinEsp->especialidades);

        // Caso 2: Carrera con múltiples especialidades
        $carreraConEsp = Carrera::factory()->create();
        $esp1 = Especialidad::factory()->create(['carrera_id' => $carreraConEsp->id]);
        $esp2 = Especialidad::factory()->create(['carrera_id' => $carreraConEsp->id]);

        $this->assertCount(2, $carreraConEsp->fresh()->especialidades);
        $this->assertTrue($carreraConEsp->especialidades->contains($esp1));
        $this->assertTrue($carreraConEsp->especialidades->contains($esp2));
    }

    public function test_comercio_can_access_especialidades_through_carreras(): void
    {
        $comercio = Comercio::factory()->create();
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);
        $especialidad = Especialidad::factory()->create(['carrera_id' => $carrera->id]);

        $this->assertCount(1, $comercio->especialidades);
        $this->assertTrue($comercio->especialidades->contains($especialidad));
    }

    public function test_deleting_carrera_cascades_to_especialidades(): void
    {
        $carrera = Carrera::factory()->create();
        $especialidad = Especialidad::factory()->create(['carrera_id' => $carrera->id]);

        $this->assertDatabaseHas('especialidades', ['id' => $especialidad->id]);

        $carrera->delete();

        $this->assertDatabaseMissing('especialidades', ['id' => $especialidad->id]);
    }
}
