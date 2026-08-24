<?php

namespace Database\Seeders;

use App\Models\Comercio;
use App\Models\Curso;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cursosData = [
            'cecava' => [
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Operación y Mantenimiento de Maquinaria Pesada',
                    'flyer' => 'https://cecava.pe/img/flyers/curso-maquinaria.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/curso-maquinaria.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-maquinaria',
                    'precio' => 'S/ 250',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-curso-maquinaria',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Seguridad y Salud en el Trabajo (Ley 29783)',
                    'flyer' => 'https://cecava.pe/img/flyers/curso-sst.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/curso-sst.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-sst',
                    'precio' => 'S/ 180',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-curso-sst',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Manejo Defensivo y Seguridad Vial en Minería',
                    'flyer' => 'https://cecava.pe/img/flyers/curso-manejo-defensivo.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/curso-manejo-defensivo.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-manejo',
                    'precio' => 'S/ 200',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-curso-manejo',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Primeros Auxilios y Brigadas de Emergencia',
                    'flyer' => 'https://cecava.pe/img/flyers/curso-primeros-auxilios.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/curso-primeros-auxilios.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-primeros-auxilios',
                    'precio' => 'S/ 150',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-curso-auxilios',
                ],
            ],
            'cecava-min' => [
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Operación y Mantenimiento de Maquinaria Pesada Minera',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-maquinaria-minera.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-maquinaria-minera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-maquinaria',
                    'precio' => 'S/ 280',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-maquinaria-2026',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Seguridad Minera y Salud Ocupacional (DS 024-2016-EM)',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-seguridad-minera.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-seguridad-minera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-seguridad',
                    'precio' => 'S/ 220',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-seguridad-2026',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Perforación y Voladura en Minería Subterránea y Superficial',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-perforacion-voladura.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-perforacion-voladura.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-voladura',
                    'precio' => 'S/ 260',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-voladura-2026',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Manejo Defensivo en Operaciones Mineras y Camiones 797F',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-manejo-camiones.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-manejo-camiones.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-camiones',
                    'precio' => 'S/ 250',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-camiones-2026',
                ],
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Supervisión y Control de Operaciones Mineras',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-supervision-minera.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-supervision-minera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-supervision',
                    'precio' => 'S/ 380',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-supervision-2026',
                ],
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Ventilación de Minas y Monitoreo de Gases',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-ventilacion-gases.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-ventilacion-gases.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-ventilacion',
                    'precio' => 'S/ 360',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-ventilacion-2026',
                ],
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Gestión Ambiental y Fiscalización en Minería',
                    'flyer' => 'https://cecava-min.pe/img/flyers/curso-gestion-ambiental-minera.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/curso-gestion-ambiental-minera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-ambiental',
                    'precio' => 'S/ 350',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-ambiental-2026',
                ],
            ],
            'next-online' => [
                // Cursos Tradicionales
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Marketing Digital y Redes Sociales',
                    'flyer' => 'https://nextonline.pe/img/flyers/marketing-digital.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/marketing-digital.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-mkt-digital',
                    'precio' => 'S/ 150',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-mkt-2026',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Excel Empresarial y Gestión de Datos',
                    'flyer' => 'https://nextonline.pe/img/flyers/excel-empresarial.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/excel-empresarial.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-excel-datos',
                    'precio' => 'S/ 120',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-excel-2026',
                ],
                [
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Diseño Gráfico Publicitario con Canva y Photoshop',
                    'flyer' => 'https://nextonline.pe/img/flyers/diseno-grafico.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/diseno-grafico.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-diseno-grafico',
                    'precio' => 'S/ 160',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-diseno-2026',
                ],
                // Cursos Especializados
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Desarrollo Web Full Stack (React & Node.js)',
                    'flyer' => 'https://nextonline.pe/img/flyers/fullstack-react.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/fullstack-react.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-fullstack-dev',
                    'precio' => 'S/ 350',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-fullstack-2026',
                ],
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Inteligencia Artificial Aplicada a Negocios',
                    'flyer' => 'https://nextonline.pe/img/flyers/ia-negocios.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/ia-negocios.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-ia-negocios',
                    'precio' => 'S/ 380',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-ia-2026',
                ],
                [
                    'tipo' => 'especializado',
                    'nombre' => 'Curso Especializado en Ciberseguridad Ofensiva y Pentesting',
                    'flyer' => 'https://nextonline.pe/img/flyers/ciberseguridad.jpg',
                    'brochure' => 'https://nextonline.pe/docs/brochures/ciberseguridad.pdf',
                    'youtube' => 'https://youtube.com/watch?v=next-ciberseguridad',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/next-ciber-2026',
                ],
            ],
            'matpel' => [
                [
                    'tipo' => null,
                    'nombre' => 'Curso de Manejo de Materiales Peligrosos - MATPEL / HAZMAT Nivel I (Advertencia)',
                    'flyer' => 'https://matpel.pe/img/flyers/curso-matpel-nivel1.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/curso-matpel-nivel1.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-hazmat1',
                    'precio' => 'S/ 220',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-hazmat1-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Curso de Operaciones con Materiales Peligrosos - MATPEL / HAZMAT Nivel II (Operacional)',
                    'flyer' => 'https://matpel.pe/img/flyers/curso-matpel-nivel2.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/curso-matpel-nivel2.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-hazmat2',
                    'precio' => 'S/ 280',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-hazmat2-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Curso de Transporte Seguro de Sustancias y Cargas Peligrosas por Carretera',
                    'flyer' => 'https://matpel.pe/img/flyers/curso-transporte-peligroso.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/curso-transporte-peligroso.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-transporte',
                    'precio' => 'S/ 250',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-transporte-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Curso de Brigadas de Emergencia Contra Incendios y Control de Derrames Químicos',
                    'flyer' => 'https://matpel.pe/img/flyers/curso-brigadas-quimicas.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/curso-brigadas-quimicas.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-brigadas',
                    'precio' => 'S/ 240',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-brigadas-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Curso de Toxicología Ocupacional y Primeros Auxilios en Incidentes Químicos',
                    'flyer' => 'https://matpel.pe/img/flyers/curso-toxicologia.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/curso-toxicologia.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-toxicologia',
                    'precio' => 'S/ 200',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-toxicologia-2026',
                ],
            ],
            'istp-avanti' => [
                // COSMETOLOGIA (AVA-COS)
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Curso de Técnicas Avanzadas de Maquillaje y Peinado Profesional',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-maquillaje.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-maquillaje.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-maquillaje',
                    'precio' => 'S/ 200',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-maquillaje-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Curso de Manicura Rusa, Polygel y Uñas Esculpidas',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-manicura.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-manicura.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-manicura',
                    'precio' => 'S/ 180',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-manicura-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Curso de Extensiones de Pestañas Pelo a Pelo y Lifting',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-pestanas.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-pestanas.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-pestanas',
                    'precio' => 'S/ 160',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-pestanas-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Curso de Colorimetría y Balayage Moderno',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-colorimetria.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-colorimetria.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-colorimetria',
                    'precio' => 'S/ 220',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-color-2026',
                ],
                // ADMINISTRACIÓN DE SERVICIOS DE HOSTELERÍA (AVA-ASH)
                [
                    'carrera_codigo' => 'AVA-ASH',
                    'tipo' => null,
                    'nombre' => 'Curso Taller de Barismo y Coctelería Internacional',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-barismo.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-barismo.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-barismo',
                    'precio' => 'S/ 180',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-barismo-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-ASH',
                    'tipo' => null,
                    'nombre' => 'Curso de Housekeeping, Protocolo y Recepción Hotelera',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-housekeeping.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-housekeeping.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-housekeeping',
                    'precio' => 'S/ 160',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-housekeeping-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-ASH',
                    'tipo' => null,
                    'nombre' => 'Curso de Manipulación Higiénica de Alimentos y BPM en Restaurantes',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-bpm.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-bpm.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-bpm',
                    'precio' => 'S/ 150',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-bpm-2026',
                ],
                // GUIA OFICIAL DE TURISMO (AVA-GOT)
                [
                    'carrera_codigo' => 'AVA-GOT',
                    'tipo' => null,
                    'nombre' => 'Curso de Técnicas de Guiado y Primeros Auxilios en Rutas Turísticas',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-guiado.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-guiado.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-guiado',
                    'precio' => 'S/ 170',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-guiado-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-GOT',
                    'tipo' => null,
                    'nombre' => 'Curso de Inglés Turístico Aplicado a Circuitos y Arqueología',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-curso-ingles.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-curso-ingles.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-curso-ingles',
                    'precio' => 'S/ 160',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-ingles-2026',
                ],
            ],

            'istp-sis' => [
                [
                    'carrera_codigo' => 'SIS-DSI',
                    'tipo' => 'tradicional',
                    'nombre' => 'Curso de Ensamblaje y Mantenimiento de Computadoras',
                    'flyer' => 'https://istpsis.edu.pe/img/flyer-curso-hardware.jpg',
                    'brochure' => 'https://istpsis.edu.pe/docs/brochure-curso-hardware.pdf',
                    'youtube' => 'https://youtube.com/watch?v=sis-curso-hw',
                    'precio' => 'S/ 220',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/sis-hardware',
                ],
            ],
        ];

        foreach ($cursosData as $comercioSlug => $items) {
            $comercio = Comercio::where('slug', $comercioSlug)->first();

            if (! $comercio) {
                continue;
            }

            foreach ($items as $item) {
                $carreraId = null;
                if (! empty($item['carrera_codigo'])) {
                    $carrera = \App\Models\Carrera::where('comercio_id', $comercio->id)
                        ->where('codigo', $item['carrera_codigo'])
                        ->first();
                    $carreraId = $carrera?->id;
                }

                Curso::updateOrCreate(
                    [
                        'comercio_id' => $comercio->id,
                        'slug' => Str::slug($item['nombre']),
                    ],
                    [
                        'carrera_id' => $carreraId,
                        'nombre' => $item['nombre'],
                        'tipo' => $item['tipo'] ?? null,
                        'flyer' => $item['flyer'] ?? null,
                        'brochure' => $item['brochure'] ?? null,
                        'youtube' => $item['youtube'] ?? null,
                        'precio' => $item['precio'] ?? null,
                        'actualizado_drive' => $item['actualizado_drive'] ?? null,
                    ]
                );
            }
        }
    }
}
