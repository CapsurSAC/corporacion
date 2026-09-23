<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
use App\Models\Rubro;
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

    public function test_especialidad_belongs_to_rubro(): void
    {
        $rubro = Rubro::factory()->create(['nombre' => 'Tecnología y Software']);
        $especialidad = Especialidad::factory()->create([
            'rubro_id' => $rubro->id,
            'nombre' => 'Especialidad en IA Aplicada',
        ]);

        $this->assertInstanceOf(Rubro::class, $especialidad->rubro);
        $this->assertEquals($rubro->id, $especialidad->rubro->id);
        $this->assertEquals('Tecnología y Software', $especialidad->rubro->nombre);
    }

    public function test_rubro_can_have_many_especialidades(): void
    {
        $rubro = Rubro::factory()->create();
        $esp1 = Especialidad::factory()->create(['rubro_id' => $rubro->id]);
        $esp2 = Especialidad::factory()->create(['rubro_id' => $rubro->id]);

        $this->assertCount(2, $rubro->fresh()->especialidades);
        $this->assertTrue($rubro->especialidades->contains($esp1));
        $this->assertTrue($rubro->especialidades->contains($esp2));
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

    public function test_comercio_can_access_especialidades(): void
    {
        $comercio = Comercio::factory()->create();
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);
        $especialidad = Especialidad::factory()->create([
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera->id,
        ]);

        $this->assertCount(1, $comercio->especialidades);
        $this->assertTrue($comercio->especialidades->contains($especialidad));
    }

    public function test_deleting_carrera_sets_null_on_especialidades(): void
    {
        $carrera = Carrera::factory()->create();
        $especialidad = Especialidad::factory()->create(['carrera_id' => $carrera->id]);

        $this->assertDatabaseHas('especialidades', ['id' => $especialidad->id]);

        $carrera->delete();

        $this->assertDatabaseHas('especialidades', ['id' => $especialidad->id]);
        $this->assertNull($especialidad->fresh()->carrera_id);
    }

    public function test_deleting_rubro_cascades_to_especialidades(): void
    {
        $rubro = Rubro::factory()->create();
        $especialidad = Especialidad::factory()->create(['rubro_id' => $rubro->id]);

        $this->assertDatabaseHas('especialidades', ['id' => $especialidad->id]);

        $rubro->delete();

        $this->assertDatabaseMissing('especialidades', ['id' => $especialidad->id]);
    }
}
