<?php

namespace Database\Seeders;

use App\Models\Rubro;
use Illuminate\Database\Seeder;

class RubroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rubros = [
            // Modalidades de formación
            [
                'nombre' => 'Curso Tradicional',
                'clave' => 'tradicional',
                'color_hex' => '#0284c7',
                'categoria' => 'Modalidad de Formación',
                'descripcion' => 'Cursos convencionales con enfoque estructurado y certificación estándar.',
                'orden' => 1,
                'activo' => true,
            ],
            [
                'nombre' => 'Curso Especializado',
                'clave' => 'especializado',
                'color_hex' => '#7c3aed',
                'categoria' => 'Modalidad de Formación',
                'descripcion' => 'Cursos de alta especialización técnica o profesional avanzada.',
                'orden' => 2,
                'activo' => true,
            ],

            // CECAVA (Rubros Técnicos)
            [
                'nombre' => 'Ambientales',
                'clave' => 'ambientales',
                'color_hex' => '#059669',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Gestión, evaluación y fiscalización ambiental, recursos hídricos y sostenibilidad.',
                'orden' => 3,
                'activo' => true,
            ],
            [
                'nombre' => 'Calidad e ISOs',
                'clave' => 'calidad_isos',
                'color_hex' => '#0284c7',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Sistemas integrados de gestión, normas ISO 9001, 14001, 45001 y auditorías.',
                'orden' => 4,
                'activo' => true,
            ],
            [
                'nombre' => 'Mineros',
                'clave' => 'mineros',
                'color_hex' => '#d97706',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Operaciones mineras, geotecnia, seguridad minera y procesamiento de minerales.',
                'orden' => 5,
                'activo' => true,
            ],
            [
                'nombre' => 'Administración',
                'clave' => 'administracion',
                'color_hex' => '#0d9488',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Gestión pública, contrataciones del Estado, finanzas y gerencia corporativa.',
                'orden' => 6,
                'activo' => true,
            ],
            [
                'nombre' => 'Arquitectura e Ingeniería',
                'clave' => 'arquitectura_ingenieria',
                'color_hex' => '#6366f1',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Diseño arquitectónico, cálculo estructural, supervisión de obras y BIM.',
                'orden' => 7,
                'activo' => true,
            ],
            [
                'nombre' => 'OSHA / Seguridad Ocupacional',
                'clave' => 'osha',
                'color_hex' => '#dc2626',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Seguridad y salud en el trabajo, prevención de riesgos laborales y normativas OSHA.',
                'orden' => 8,
                'activo' => true,
            ],
            [
                'nombre' => 'Comercio Exterior',
                'clave' => 'comercio_exterior',
                'color_hex' => '#0891b2',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Aduanas, logística internacional, importación, exportación y tratados comerciales.',
                'orden' => 9,
                'activo' => true,
            ],
            [
                'nombre' => 'Rubro Legal',
                'clave' => 'rubro_legal',
                'color_hex' => '#7c3aed',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Derecho administrativo, minero, ambiental, laboral y procesal aplicado.',
                'orden' => 10,
                'activo' => true,
            ],
            [
                'nombre' => 'No Actualizados',
                'clave' => 'no_actualizados',
                'color_hex' => '#64748b',
                'categoria' => 'CECAVA (Rubros Técnicos)',
                'descripcion' => 'Programas de archivo o en proceso de revisión curricular.',
                'orden' => 11,
                'activo' => true,
            ],

            // MAGISTER (Educación)
            [
                'nombre' => 'Nombramiento Docente',
                'clave' => 'nombramiento',
                'color_hex' => '#7c3aed',
                'categoria' => 'MAGISTER (Educación)',
                'descripcion' => 'Preparación especializada para concursos docentes y carrera magisterial pública.',
                'orden' => 12,
                'activo' => true,
            ],
            [
                'nombre' => 'Secundaria',
                'clave' => 'secundaria',
                'color_hex' => '#059669',
                'categoria' => 'MAGISTER (Educación)',
                'descripcion' => 'Especialidades pedagógicas y didácticas para el nivel de educación secundaria.',
                'orden' => 13,
                'activo' => true,
            ],
            [
                'nombre' => 'Genérico / Otros',
                'clave' => 'generico',
                'color_hex' => '#0284c7',
                'categoria' => 'MAGISTER (Educación)',
                'descripcion' => 'Programas formativos multidisciplinarios y de formación continua.',
                'orden' => 14,
                'activo' => true,
            ],
        ];

        foreach ($rubros as $data) {
            Rubro::updateOrCreate(
                ['clave' => $data['clave']],
                $data
            );
        }
    }
}
