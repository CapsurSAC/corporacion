<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $grupos = Grupo::query()
            ->with([
                'comercios' => function ($query) {
                    $query->withCount('carreras')->orderBy('nombre');
                },
            ])
            ->withCount(['comercios', 'carreras'])
            ->orderBy('id')
            ->get();

        $stats = [
            'total_grupos' => Grupo::count(),
            'total_comercios' => Comercio::count(),
            'total_carreras' => Carrera::count(),
        ];

        return Inertia::render('dashboard', [
            'grupos' => $grupos,
            'stats' => $stats,
        ]);
    }
}
