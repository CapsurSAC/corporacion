<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Diplomado;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarreraUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_carrera_belongs_to_comercio(): void
    {
        $comercio = Comercio::factory()->create(['nombre' => 'ISTP AVANTI']);
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id, 'nombre' => 'Gastronomía y Arte Culinario']);

        $this->assertInstanceOf(Comercio::class, $carrera->comercio);
        $this->assertEquals('ISTP AVANTI', $carrera->comercio->nombre);
    }

    public function test_carrera_has_many_diplomados_and_cursos(): void
    {
        $carrera = Carrera::factory()->create();
        $diplomado = Diplomado::factory()->create(['carrera_id' => $carrera->id, 'comercio_id' => $carrera->comercio_id]);
        $curso = Curso::factory()->create(['carrera_id' => $carrera->id, 'comercio_id' => $carrera->comercio_id]);

        $this->assertCount(1, $carrera->diplomados);
        $this->assertTrue($carrera->diplomados->contains($diplomado));

        $this->assertCount(1, $carrera->cursos);
        $this->assertTrue($carrera->cursos->contains($curso));
    }
}
