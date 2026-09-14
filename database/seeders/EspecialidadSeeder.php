<?php

namespace Database\Seeders;

use App\Models\Carrera;
use App\Models\Especialidad;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EspecialidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $especialidadesPorCarrera = [
            // Desarrollo de Sistemas de Información (SIS-DSI)
            'SIS-DSI' => [
                [
                    'nombre' => 'Especialidad en Desarrollo Web Full Stack & Cloud Computing',
                    'flyer' => 'https://istpsis.edu.pe/img/flyers/especialidad-fullstack.jpg',
                    'brochure' => 'https://istpsis.edu.pe/docs/brochures/esp-fullstack.pdf',
                    'youtube' => 'https://youtube.com/watch?v=sis-esp-fullstack',
                    'precio' => 'S/ 480',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/sis-esp-fullstack-2026',
                ],
                [
                    'nombre' => 'Especialidad en Inteligencia Artificial y Machine Learning Aplicado',
                    'flyer' => 'https://istpsis.edu.pe/img/flyers/especialidad-ia.jpg',
                    'brochure' => 'https://istpsis.edu.pe/docs/brochures/esp-ia.pdf',
                    'youtube' => 'https://youtube.com/watch?v=sis-esp-ia',
                    'precio' => 'S/ 520',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/sis-esp-ia-2026',
                ],
            ],

            // Administración de Redes y Comunicaciones (SIS-ARC)
            'SIS-ARC' => [
                [
                    'nombre' => 'Especialidad en Seguridad Ofensiva y Auditoría de Redes',
                    'flyer' => 'https://istpsis.edu.pe/img/flyers/especialidad-sec-redes.jpg',
                    'brochure' => 'https://istpsis.edu.pe/docs/brochures/esp-sec-redes.pdf',
                    'youtube' => 'https://youtube.com/watch?v=sis-esp-redes',
                    'precio' => 'S/ 490',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/sis-esp-redes-2026',
                ],
            ],

            // GUIA OFICIAL DE TURISMO (AVA-GOT)
            'AVA-GOT' => [
                [
                    'nombre' => 'Especialidad en Ecoturismo y Gestión de Rutas de Alta Montaña',
                    'flyer' => 'https://avanti.edu.pe/img/flyers/esp-ecoturismo.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochures/esp-ecoturismo.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-esp-ecoturismo',
                    'precio' => 'S/ 450',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-esp-ecoturismo-2026',
                ],
            ],

            // ADMINISTRACIÓN DE SERVICIOS DE HOSTELERÍA (AVA-ASH)
            'AVA-ASH' => [
                [
                    'nombre' => 'Especialidad en Gestión y Gerencia Hotelera Internacional',
                    'flyer' => 'https://avanti.edu.pe/img/flyers/esp-gerencia-hotelera.jpg',
                    'brochure' => 'https://avanti.edu.pe/docs/brochures/esp-gerencia-hotelera.pdf',
                    'youtube' => 'https://youtube.com/watch?v=avanti-esp-hoteles',
                    'precio' => 'S/ 470',
                    'actualizado_drive' => 'https://drive.google.com/drive/folders/avanti-esp-hoteles-2026',
                ],
            ],
        ];

        foreach ($especialidadesPorCarrera as $codigoCarrera => $especialidades) {
            $carrera = Carrera::where('codigo', $codigoCarrera)->first();

            if (! $carrera) {
                // Si no se encuentra por código, intentar buscar por similitud
                continue;
            }

            foreach ($especialidades as $item) {
                Especialidad::updateOrCreate(
                    [
                        'carrera_id' => $carrera->id,
                        'slug' => Str::slug($item['nombre']),
                    ],
                    [
                        'nombre' => $item['nombre'],
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
