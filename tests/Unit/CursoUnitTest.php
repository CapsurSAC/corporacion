<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CursoUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_curso_belongs_to_comercio(): void
    {
        $comercio = Comercio::factory()->create(['nombre' => 'MATPEL']);
        $curso = Curso::factory()->create(['comercio_id' => $comercio->id]);

        $this->assertInstanceOf(Comercio::class, $curso->comercio);
        $this->assertEquals('MATPEL', $curso->comercio->nombre);
    }

    public function test_curso_can_belong_to_carrera(): void
    {
        $comercio = Comercio::factory()->create();
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);
        $curso = Curso::factory()->create([
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera->id,
        ]);

        $this->assertInstanceOf(Carrera::class, $curso->carrera);
        $this->assertEquals($carrera->id, $curso->carrera->id);
    }
}
