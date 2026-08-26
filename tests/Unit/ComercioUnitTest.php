<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Grupo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComercioUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_comercio_can_be_instantiated_with_casts(): void
    {
        $grupo = Grupo::factory()->create();
        $comercio = Comercio::factory()->create([
            'grupo_id' => $grupo->id,
            'nombre' => 'Instituto de Educación Superior SIS',
            'canales_youtube' => ['https://youtube.com/c/sis', 'https://youtube.com/watch?v=123'],
            'fotos' => ['https://example.com/foto1.jpg', 'https://example.com/foto2.jpg'],
            'custom_attributes' => ['acreditacion' => 'SUNEDU', 'sede_principal' => 'Arequipa'],
            'activo' => true,
        ]);

        $this->assertDatabaseHas('comercios', [
            'id' => $comercio->id,
            'nombre' => 'Instituto de Educación Superior SIS',
        ]);

        $this->assertTrue($comercio->activo);
        $this->assertIsArray($comercio->canales_youtube);
        $this->assertCount(2, $comercio->canales_youtube);
        $this->assertIsArray($comercio->fotos);
        $this->assertCount(2, $comercio->fotos);
        $this->assertEquals('SUNEDU', $comercio->custom_attributes['acreditacion']);
    }

    public function test_comercio_belongs_to_grupo(): void
    {
        $grupo = Grupo::factory()->create(['nombre' => 'Grupo Escifor']);
        $comercio = Comercio::factory()->create(['grupo_id' => $grupo->id]);

        $this->assertInstanceOf(Grupo::class, $comercio->grupo);
        $this->assertEquals('Grupo Escifor', $comercio->grupo->nombre);
    }

    public function test_comercio_has_many_carreras_diplomados_and_cursos(): void
    {
        $comercio = Comercio::factory()->create();

        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);
        $diplomado = Diplomado::factory()->create(['comercio_id' => $comercio->id]);
        $curso = Curso::factory()->create(['comercio_id' => $comercio->id]);

        $this->assertCount(1, $comercio->carreras);
        $this->assertTrue($comercio->carreras->contains($carrera));

        $this->assertCount(1, $comercio->diplomados);
        $this->assertTrue($comercio->diplomados->contains($diplomado));

        $this->assertCount(1, $comercio->cursos);
        $this->assertTrue($comercio->cursos->contains($curso));
    }
}
