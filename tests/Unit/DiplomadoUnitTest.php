<?php

namespace Tests\Unit;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Diplomado;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiplomadoUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_diplomado_belongs_to_comercio(): void
    {
        $comercio = Comercio::factory()->create(['nombre' => 'CECAVA']);
        $diplomado = Diplomado::factory()->create(['comercio_id' => $comercio->id]);

        $this->assertInstanceOf(Comercio::class, $diplomado->comercio);
        $this->assertEquals('CECAVA', $diplomado->comercio->nombre);
    }

    public function test_diplomado_can_belong_to_carrera(): void
    {
        $comercio = Comercio::factory()->create();
        $carrera = Carrera::factory()->create(['comercio_id' => $comercio->id]);
        $diplomado = Diplomado::factory()->create([
            'comercio_id' => $comercio->id,
            'carrera_id' => $carrera->id,
        ]);

        $this->assertInstanceOf(Carrera::class, $diplomado->carrera);
        $this->assertEquals($carrera->id, $diplomado->carrera->id);
    }
}
