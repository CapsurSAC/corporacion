<?php

namespace Database\Seeders;

use App\Models\Comercio;
use App\Models\Diplomado;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DiplomadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $diplomadosData = [
            'cecava' => [
                // 1. DIPLOMADOS AMBIENTALES
                [
                    'tipo' => 'ambientales',
                    'nombre' => 'Diplomado en Gestión y Evaluación de Impacto Ambiental (EIA)',
                    'flyer' => 'https://cecava.pe/img/flyers/ambiental-eia.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/ambiental-eia.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-eia',
                    'precio' => 'S/ 390',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-ambientales-2026',
                ],
                [
                    'tipo' => 'ambientales',
                    'nombre' => 'Diplomado en Fiscalización y Monitoreo Ambiental OEFA',
                    'flyer' => 'https://cecava.pe/img/flyers/ambiental-oefa.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/ambiental-oefa.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-oefa',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-oefa-2026',
                ],

                // 2. DIPLOMADOS CALIDAD ISOS
                [
                    'tipo' => 'calidad_isos',
                    'nombre' => 'Diplomado en Sistemas Integrados de Gestión SIG (ISO 9001, 14001, 45001)',
                    'flyer' => 'https://cecava.pe/img/flyers/calidad-sig.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/calidad-sig.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-sig',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-sig-2026',
                ],
                [
                    'tipo' => 'calidad_isos',
                    'nombre' => 'Diplomado en Auditor Líder en Sistemas de Gestión ISO',
                    'flyer' => 'https://cecava.pe/img/flyers/calidad-auditor.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/calidad-auditor.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-auditor',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-auditor-2026',
                ],

                // 3. DIPLOMADOS MINEROS
                [
                    'tipo' => 'mineros',
                    'nombre' => 'Diplomado en Seguridad y Salud Ocupacional en Minería (D.S. 024-2016-EM)',
                    'flyer' => 'https://cecava.pe/img/flyers/mineros-ssoma.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/mineros-ssoma.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-mineria-ssoma',
                    'precio' => 'S/ 460',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-mineria-2026',
                ],
                [
                    'tipo' => 'mineros',
                    'nombre' => 'Diplomado en Gestión de Operaciones y Procesos Metalúrgicos',
                    'flyer' => 'https://cecava.pe/img/flyers/mineros-operaciones.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/mineros-operaciones.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-metalurgia',
                    'precio' => 'S/ 490',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-metalurgia-2026',
                ],

                // 4. DIPLOMADOS ADMINISTRACIÓN
                [
                    'tipo' => 'administracion',
                    'nombre' => 'Diplomado en Administración Estratégica y Dirección de Empresas',
                    'flyer' => 'https://cecava.pe/img/flyers/admin-estrategica.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/admin-estrategica.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-admin',
                    'precio' => 'S/ 380',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-admin-2026',
                ],
                [
                    'tipo' => 'administracion',
                    'nombre' => 'Diplomado en Gestión de Recursos Humanos y Clima Laboral',
                    'flyer' => 'https://cecava.pe/img/flyers/admin-rrhh.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/admin-rrhh.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-rrhh',
                    'precio' => 'S/ 360',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-rrhh-2026',
                ],

                // 5. DIPLOMADOS ARQUITECTURA E INGENIERÍA
                [
                    'tipo' => 'arquitectura_ingenieria',
                    'nombre' => 'Diplomado en Gestión de Proyectos de Construcción con Metodología BIM',
                    'flyer' => 'https://cecava.pe/img/flyers/arq-bim.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/arq-bim.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-bim',
                    'precio' => 'S/ 520',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-bim-2026',
                ],
                [
                    'tipo' => 'arquitectura_ingenieria',
                    'nombre' => 'Diplomado en Residencia y Supervisión de Obras Públicas y Privadas',
                    'flyer' => 'https://cecava.pe/img/flyers/arq-supervision.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/arq-supervision.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-supervision',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-supervision-2026',
                ],

                // 6. DIPLOMADOS OSHA
                [
                    'tipo' => 'osha',
                    'nombre' => 'Diplomado Internacional en Normativa y Estándares OSHA 30 Horas',
                    'flyer' => 'https://cecava.pe/img/flyers/osha-standards.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/osha-standards.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-osha',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-osha-2026',
                ],

                // 7. DIPLOMADOS COMERCIO EXTERIOR
                [
                    'tipo' => 'comercio_exterior',
                    'nombre' => 'Diplomado en Negocios Internacionales y Gestión Aduanera',
                    'flyer' => 'https://cecava.pe/img/flyers/comex-aduanas.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/comex-aduanas.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-comex',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-comex-2026',
                ],

                // 8. DIPLOMADOS RUBRO LEGAL
                [
                    'tipo' => 'rubro_legal',
                    'nombre' => 'Diplomado en Derecho Laboral, Inspecciones SUNAFIL y Seguridad',
                    'flyer' => 'https://cecava.pe/img/flyers/legal-sunafil.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/legal-sunafil.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-sunafil',
                    'precio' => 'S/ 410',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-legal-2026',
                ],

                // 9. DIPLOMADOS NO ACTUALIZADOS
                [
                    'tipo' => 'no_actualizados',
                    'nombre' => 'Diplomado en Mantenimiento Predictivo y Análisis de Vibraciones (Histórico)',
                    'flyer' => 'https://cecava.pe/img/flyers/no-act-vibraciones.jpg',
                    'brochure' => 'https://cecava.pe/docs/brochures/no-act-vibraciones.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-vibraciones-old',
                    'precio' => 'S/ 280',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-archivo-historico',
                ],
            ],

            'magister' => [
                // 1. Tipo Nombramiento
                [
                    'tipo' => 'nombramiento',
                    'nombre' => 'Diplomado en Preparación Integral para el Nombramiento Docente 2026',
                    'flyer' => 'https://magister.edu.pe/img/flyers/nombramiento-docente.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/nombramiento-docente.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-nombramiento',
                    'precio' => 'S/ 380',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-nombramiento-2026',
                ],
                [
                    'tipo' => 'nombramiento',
                    'nombre' => 'Diplomado en Ascenso de Escala Magisterial y Cargos Directivos',
                    'flyer' => 'https://magister.edu.pe/img/flyers/ascenso-magisterial.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/ascenso-magisterial.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-ascenso',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-ascenso-2026',
                ],
                // 2. Tipo Secundaria
                [
                    'tipo' => 'secundaria',
                    'nombre' => 'Diplomado en Didáctica y Estrategias Pedagógicas para Educación Secundaria',
                    'flyer' => 'https://magister.edu.pe/img/flyers/didactica-secundaria.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/didactica-secundaria.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-secundaria',
                    'precio' => 'S/ 350',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-secundaria-2026',
                ],
                [
                    'tipo' => 'secundaria',
                    'nombre' => 'Diplomado en Planificación Curricular y Evaluación Formativa en Secundaria',
                    'flyer' => 'https://magister.edu.pe/img/flyers/evaluacion-secundaria.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/evaluacion-secundaria.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-evaluacion',
                    'precio' => 'S/ 360',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-evaluacion-2026',
                ],
                // 3. Tipo Generico
                [
                    'tipo' => 'generico',
                    'nombre' => 'Diplomado en Gestión Pública y Gobernabilidad Educativa',
                    'flyer' => 'https://magister.edu.pe/img/flyers/gestion-publica.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/gestion-publica.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-gp',
                    'precio' => 'S/ 400',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-gp-2026',
                ],
                [
                    'tipo' => 'generico',
                    'nombre' => 'Diplomado en Neuroeducación y Psicopedagogía Aplicada al Aula',
                    'flyer' => 'https://magister.edu.pe/img/flyers/neuroeducacion.jpg',
                    'brochure' => 'https://magister.edu.pe/docs/brochures/neuroeducacion.pdf',
                    'youtube' => 'https://youtube.com/watch?v=magister-neuroeducacion',
                    'precio' => 'S/ 390',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/magister-neuroeducacion-2026',
                ],
            ],
            'cecava-min' => [
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Gestión Integral de Operaciones y Seguridad Minera',
                    'flyer' => 'https://cecava-min.pe/img/flyers/dip-operaciones-mineras.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/dip-operaciones-mineras.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-dip1',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-dip-operaciones-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Geomecánica y Estabilidad de Taludes en Minería',
                    'flyer' => 'https://cecava-min.pe/img/flyers/dip-geomecanica.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/dip-geomecanica.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-geomecanica',
                    'precio' => 'S/ 520',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-geomecanica-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Normas OSHA y Prevención de Riesgos en Minería',
                    'flyer' => 'https://cecava-min.pe/img/flyers/dip-osha-mineria.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/dip-osha-mineria.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-osha',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-osha-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Planificación Estratégica de Minas y Open Pit',
                    'flyer' => 'https://cecava-min.pe/img/flyers/dip-planificacion-minera.jpg',
                    'brochure' => 'https://cecava-min.pe/docs/brochures/dip-planificacion-minera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=cecava-min-planificacion',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/cecava-min-planificacion-2026',
                ],
            ],

            'matpel' => [
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Gestión Integral de Materiales Peligrosos y Control de Emergencias (HAZMAT)',
                    'flyer' => 'https://matpel.pe/img/flyers/dip-matpel-hazmat.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/dip-matpel-hazmat.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-dip1',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-dip-hazmat-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado Internacional en Seguridad Química y Respuesta a Incidentes con MATPEL',
                    'flyer' => 'https://matpel.pe/img/flyers/dip-seguridad-quimica.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/dip-seguridad-quimica.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-dip2',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-seguridad-quimica-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Prevención de Riesgos Industriales y Normativas NFPA / OSHA',
                    'flyer' => 'https://matpel.pe/img/flyers/dip-nfpa-osha.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/dip-nfpa-osha.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-dip3',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-nfpa-osha-2026',
                ],
                [
                    'tipo' => null,
                    'nombre' => 'Diplomado en Auditoría y Planes de Contingencia para Transporte de Carga Peligrosa',
                    'flyer' => 'https://matpel.pe/img/flyers/dip-contingencia-transporte.jpg',
                    'brochure' => 'https://matpel.pe/docs/brochures/dip-contingencia-transporte.pdf',
                    'youtube' => 'https://youtube.com/watch?v=matpel-dip4',
                    'precio' => 'S/ 400',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/matpel-contingencia-2026',
                ],
            ],

            'istp-avanti' => [
                // COSMETOLOGIA (AVA-COS)
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Cosmiatría Avanzada y Estética Integral',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-estetica.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-estetica.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-cosmiatria',
                    'precio' => 'S/ 380',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-cosmiatria-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Micropigmentación, Microblading y Cejas HD',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-micro.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-micro.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-micro',
                    'precio' => 'S/ 420',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-micro-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-COS',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Tricología y Técnicas Capilares Avanzadas',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-trico.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-trico.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-trico',
                    'precio' => 'S/ 360',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-trico-2026',
                ],
                // ADMINISTRACIÓN DE SERVICIOS DE HOSTELERÍA (AVA-ASH)
                [
                    'carrera_codigo' => 'AVA-ASH',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Gestión Hotelera y Revenue Management Sostenible',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-hotel.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-hotel.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-hotel',
                    'precio' => 'S/ 400',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-hotel-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-ASH',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Administración de Alimentos y Bebidas (Food & Beverage)',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-fb.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-fb.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-fb',
                    'precio' => 'S/ 390',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-fb-2026',
                ],
                // GUIA OFICIAL DE TURISMO (AVA-GOT)
                [
                    'carrera_codigo' => 'AVA-GOT',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Ecoturismo y Guiado Especializado de Aventura',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-eco.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-eco.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-eco',
                    'precio' => 'S/ 370',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-eco-2026',
                ],
                [
                    'carrera_codigo' => 'AVA-GOT',
                    'tipo' => null,
                    'nombre' => 'Diplomado en Patrimonio Cultural y Arqueológico del Perú',
                    'flyer' => 'https://avanti.edu.pe/img/flyer-dip-patrimonio.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochure-dip-patrimonio.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-dip-patrimonio',
                    'precio' => 'S/ 360',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-patrimonio-2026',
                ],
            ],

            'istp-sis' => [
                [
                    'carrera_codigo' => 'SIS-DSI',
                    'tipo' => 'generico',
                    'nombre' => 'Diplomado en Ciberseguridad & Ethical Hacking',
                    'flyer' => 'https://istpsis.edu.pe/img/flyer-ciberseguridad.jpg',
                    'brochure' => 'https://istpsis.edu.pe/docs/brochure-ciberseguridad.pdf',
                    'youtube' => 'https://youtube.com/watch?v=sis-ciber',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/sis-ciberseguridad',
                ],
            ],
        ];

        foreach ($diplomadosData as $comercioSlug => $items) {
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

                Diplomado::updateOrCreate(
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
