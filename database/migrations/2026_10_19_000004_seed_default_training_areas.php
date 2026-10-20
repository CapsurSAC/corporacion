<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $areas = [
            ['Venta', 'venta', '#059669'],
            ['Postventa', 'postventa', '#0284c7'],
            ['Informática', 'informatica', '#7c3aed'],
            ['Marketing', 'marketing', '#ea580c'],
            ['Académico', 'academico', '#0c43a3'],
        ];

        foreach ($areas as [$name, $slug, $color]) {
            DB::table('training_areas')->updateOrInsert(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'color' => $color,
                    'bot_name' => "Asistente de {$name}",
                    'description' => "Asistente de capacitación para el área de {$name}.",
                    'is_active' => true,
                    'sort_order' => array_search($slug, array_column($areas, 1), true),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('training_areas')->whereIn('slug', [
            'venta', 'postventa', 'informatica', 'marketing', 'academico',
        ])->delete();
    }
};
