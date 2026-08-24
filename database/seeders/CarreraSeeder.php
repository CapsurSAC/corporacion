<?php

namespace Database\Seeders;

use App\Models\Carrera;
use App\Models\Comercio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CarreraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carrerasPorComercio = [
            'istp-sis' => [
                [
                    'nombre' => 'Desarrollo de Sistemas de Información',
                    'codigo' => 'SIS-DSI',
                    'url_malla_curricular' => 'https://istpsis.edu.pe/docs/malla-dsi.pdf',
                    'url_declaracion_jurada' => 'https://istpsis.edu.pe/docs/dj-dsi.pdf',
                    'modelo_certificado' => 'https://istpsis.edu.pe/docs/modelo-certificado-dsi.pdf',
                ],
                [
                    'nombre' => 'Administración de Redes y Comunicaciones',
                    'codigo' => 'SIS-ARC',
                    'url_malla_curricular' => 'https://istpsis.edu.pe/docs/malla-arc.pdf',
                    'url_declaracion_jurada' => 'https://istpsis.edu.pe/docs/dj-arc.pdf',
                    'modelo_certificado' => 'https://istpsis.edu.pe/docs/modelo-certificado-arc.pdf',
                ],
            ],
            'istp-avanti' => [
                [
                    'nombre' => 'GUIA OFICIAL DE TURISMO',
                    'codigo' => 'AVA-GOT',
                    'url_malla_curricular' => 'https://avanti.edu.pe/docs/malla-got.pdf',
                    'url_declaracion_jurada' => 'https://avanti.edu.pe/docs/dj-got.pdf',
                    'modelo_certificado' => 'https://avanti.edu.pe/docs/modelo-certificado-got.pdf',
                ],
                [
                    'nombre' => 'ADMINISTRACIÓN DE SERVICIOS DE HOSTELERÍA',
                    'codigo' => 'AVA-ASH',
                    'url_malla_curricular' => 'https://avanti.edu.pe/docs/malla-ash.pdf',
                    'url_declaracion_jurada' => 'https://avanti.edu.pe/docs/dj-ash.pdf',
                    'modelo_certificado' => 'https://avanti.edu.pe/docs/modelo-certificado-ash.pdf',
                ],
                [
                    'nombre' => 'COSMETOLOGIA',
                    'codigo' => 'AVA-COS',
                    'url_malla_curricular' => 'https://avanti.edu.pe/docs/malla-cos.pdf',
                    'url_declaracion_jurada' => 'https://avanti.edu.pe/docs/dj-cos.pdf',
                    'modelo_certificado' => 'https://avanti.edu.pe/docs/modelo-certificado-cos.pdf',
                ],
            ],
        ];

        // Obtener IDs de comercios permitidos (SIS y AVANTI)
        $allowedComercioIds = Comercio::whereIn('slug', array_keys($carrerasPorComercio))->pluck('id');

        // Eliminar carreras asociadas a comercios que no sean SIS o AVANTI
        Carrera::whereNotIn('comercio_id', $allowedComercioIds)->delete();

        foreach ($carrerasPorComercio as $comercioSlug => $carreras) {
            $comercio = Comercio::where('slug', $comercioSlug)->first();

            if (! $comercio) {
                continue;
            }

            $currentCodigos = array_column($carreras, 'codigo');
            Carrera::where('comercio_id', $comercio->id)
                ->whereNotIn('codigo', $currentCodigos)
                ->delete();

            foreach ($carreras as $carreraData) {
                Carrera::updateOrCreate(
                    [
                        'comercio_id' => $comercio->id,
                        'codigo' => $carreraData['codigo'],
                    ],
                    [
                        'nombre' => $carreraData['nombre'],
                        'slug' => Str::slug($carreraData['nombre']),
                        'url_malla_curricular' => $carreraData['url_malla_curricular'] ?? null,
                        'url_declaracion_jurada' => $carreraData['url_declaracion_jurada'] ?? null,
                        'modelo_certificado' => $carreraData['modelo_certificado'] ?? null,
                    ]
                );
            }
        }
    }
}
