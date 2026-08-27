<?php

namespace Database\Seeders;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Grupo;
use App\Models\Rubro;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class CapsurImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/capsur_full_dataset.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("No se encontró el archivo de datos en: {$jsonPath}");
            return;
        }

        $data = json_decode(File::get($jsonPath), true);

        if (!$data) {
            $this->command->error("El archivo JSON no contiene una estructura válida.");
            return;
        }

        $this->command->info("Iniciando importación masiva de datos desde Google Sheets...");

        // Desactivar temporalmente las restricciones de claves foráneas para limpieza segura
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Curso::truncate();
        Diplomado::truncate();
        Carrera::truncate();
        Comercio::truncate();
        Grupo::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Guardar Enlaces de Drive Capacitaciones en Setting
        if (!empty($data['capacitaciones_drive'])) {
            Setting::set('drive_escifor', $data['capacitaciones_drive']['escifor'] ?? null);
            Setting::set('drive_multimarca', $data['capacitaciones_drive']['multimarca'] ?? null);
            $this->command->info("✓ Enlaces de Drive Capacitaciones actualizados.");
        }

        // 2. Sincronizar Rubros
        if (!empty($data['rubros'])) {
            foreach ($data['rubros'] as $r) {
                Rubro::updateOrCreate(
                    ['clave' => $r['clave']],
                    [
                        'nombre' => $r['nombre'],
                        'color_hex' => $r['color_hex'] ?? '#7c3aed',
                        'categoria' => $r['categoria'] ?? 'General',
                        'orden' => $r['orden'] ?? 99,
                        'activo' => true,
                    ]
                );
            }
            $this->command->info("✓ " . count($data['rubros']) . " Rubros sincronizados.");
        }

        // 3. Crear Grupos
        $grupoMap = [];
        foreach ($data['grupos'] as $g) {
            $grupo = Grupo::create([
                'nombre' => $g['nombre'],
                'slug' => $g['slug'],
                'descripcion' => $g['descripcion'] ?? null,
                'activo' => true,
            ]);
            $grupoMap[$g['slug']] = $grupo->id;
        }
        $this->command->info("✓ " . count($grupoMap) . " Grupos comerciales creados.");

        // 4. Crear Comercios, Carreras, Diplomados y Cursos
        $totalComercios = 0;
        $totalCarreras = 0;
        $totalDiplomados = 0;
        $totalCursos = 0;

        foreach ($data['comercios'] as $c) {
            $grupoId = $grupoMap[$c['grupo_slug']] ?? null;

            if (!$grupoId) {
                $grupoId = array_values($grupoMap)[0];
            }

            $comercio = Comercio::create([
                'grupo_id' => $grupoId,
                'nombre' => $c['nombre'],
                'slug' => $c['slug'],
                'codigo' => $c['codigo'] ?? null,
                'sigla' => $c['sigla'] ?? null,
                'color_hex' => $c['color_hex'] ?? '#0c43a3',
                'logo_modo_claro' => $c['logo_modo_claro'] ?? null,
                'logo_modo_oscuro' => $c['logo_modo_oscuro'] ?? null,
                'pagina_web' => $c['pagina_web'] ?? null,
                'plataforma_carrera' => $c['plataforma_carrera'] ?? null,
                'certificado_url' => $c['certificado_url'] ?? null,
                'resolucion_revalidacion' => $c['resolucion_revalidacion'] ?? null,
                'resolucion_creacion' => $c['resolucion_creacion'] ?? null,
                'escale_minedu' => $c['escale_minedu'] ?? null,
                'link_directo_escale' => $c['link_directo_escale'] ?? null,
                'malla_curricular_url' => $c['malla_curricular_url'] ?? null,
                'catalogo_url' => $c['catalogo_url'] ?? null,
                'brochure_vacaciones_utiles' => $c['brochure_vacaciones_utiles'] ?? null,
                'como_ingresar_plataforma' => $c['como_ingresar_plataforma'] ?? null,
                'reconocimiento_director' => $c['reconocimiento_director'] ?? null,
                'seminario' => $c['seminario'] ?? null,
                'convenio' => $c['convenio'] ?? null,
                'promocion_vigente' => $c['promocion_vigente'] ?? null,
                'canales_youtube' => $c['canales_youtube'] ?? [],
                'fotos' => $c['fotos'] ?? [],
                'activo' => true,
            ]);
            $totalComercios++;

            // Mapeo local de carreras para este comercio
            $carreraMap = [];

            if (!empty($c['carreras'])) {
                foreach ($c['carreras'] as $car) {
                    $carrera = Carrera::create([
                        'comercio_id' => $comercio->id,
                        'nombre' => $car['nombre'],
                        'slug' => $car['slug'],
                        'codigo' => $car['codigo'] ?? null,
                        'tipo' => $car['tipo'] ?? 'Carrera Profesional Técnica',
                        'modalidad' => $car['modalidad'] ?? 'Virtual / Presencial',
                        'duracion' => $car['duracion'] ?? '3 años (6 Ciclos)',
                        'url_malla_curricular' => $car['url_malla_curricular'] ?? null,
                        'modelo_certificado' => $car['modelo_certificado'] ?? null,
                        'modelo_titulo' => $car['modelo_titulo'] ?? null,
                        'brochure' => $car['brochure'] ?? null,
                        'flyer' => $car['flyer'] ?? null,
                        'resolucion' => $car['resolucion'] ?? null,
                        'descripcion' => $car['descripcion'] ?? null,
                        'estado' => true,
                    ]);
                    $carreraMap[$car['slug']] = $carrera->id;
                    $totalCarreras++;
                }
            }

            // Insertar Diplomados
            if (!empty($c['diplomados'])) {
                foreach ($c['diplomados'] as $dip) {
                    $carreraId = null;
                    if (!empty($dip['carrera_slug']) && isset($carreraMap[$dip['carrera_slug']])) {
                        $carreraId = $carreraMap[$dip['carrera_slug']];
                    }

                    Diplomado::create([
                        'comercio_id' => $comercio->id,
                        'carrera_id' => $carreraId,
                        'nombre' => $dip['nombre'],
                        'slug' => $dip['slug'],
                        'tipo' => $dip['tipo'] ?? null,
                        'flyer' => $dip['flyer'] ?? null,
                        'brochure' => $dip['brochure'] ?? null,
                        'youtube' => $dip['youtube'] ?? null,
                        'precio' => $dip['precio'] ?? null,
                        'actualizado_drive' => $dip['actualizado_drive'] ?? null,
                    ]);
                    $totalDiplomados++;
                }
            }

            // Insertar Cursos
            if (!empty($c['cursos'])) {
                foreach ($c['cursos'] as $cur) {
                    $carreraId = null;
                    if (!empty($cur['carrera_slug']) && isset($carreraMap[$cur['carrera_slug']])) {
                        $carreraId = $carreraMap[$cur['carrera_slug']];
                    }

                    Curso::create([
                        'comercio_id' => $comercio->id,
                        'carrera_id' => $carreraId,
                        'nombre' => $cur['nombre'],
                        'slug' => $cur['slug'],
                        'tipo' => $cur['tipo'] ?? null,
                        'flyer' => $cur['flyer'] ?? null,
                        'brochure' => $cur['brochure'] ?? null,
                        'youtube' => $cur['youtube'] ?? null,
                        'precio' => $cur['precio'] ?? null,
                        'actualizado_drive' => $cur['actualizado_drive'] ?? null,
                    ]);
                    $totalCursos++;
                }
            }

            $this->command->info("  -> {$comercio->nombre}: " . count($c['carreras']) . " carreras, " . count($c['diplomados']) . " diplomados, " . count($c['cursos']) . " cursos.");
        }

        $this->command->info("\n=================================================");
        $this->command->info("¡IMPORTACIÓN COMPLETADA EXITOSAMENTE!");
        $this->command->info("Comercios importados:  {$totalComercios}");
        $this->command->info("Carreras importadas:   {$totalCarreras}");
        $this->command->info("Diplomados importados: {$totalDiplomados}");
        $this->command->info("Cursos importados:     {$totalCursos}");
        $this->command->info("=================================================");
    }
}
