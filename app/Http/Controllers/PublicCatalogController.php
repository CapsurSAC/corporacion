<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Especialidad;
use App\Models\Grupo;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCatalogController extends Controller
{
    /**
     * Display the public corporate catalog for workers and visitors.
     */
    public function index(Request $request): Response
    {
        $grupos = Grupo::query()
            ->where('activo', true)
            ->with([
                'comercios' => function ($query) {
                    $query->where('activo', true)
                        ->with([
                            'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                            'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'especialidades' => fn ($q) => $q->latest('id'),
                        ])
                        ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
                        ->orderBy('nombre', 'asc');
                },
            ])
            ->orderBy('id', 'asc')
            ->get();

        $stats = [
            'totalGrupos' => Grupo::where('activo', true)->count(),
            'totalComercios' => Comercio::where('activo', true)->count(),
            'totalCarreras' => Carrera::count(),
            'totalDiplomados' => Diplomado::count(),
            'totalCursos' => Curso::count(),
            'totalEspecialidades' => Especialidad::count(),
        ];

        $driveLinks = [
            'escifor' => Setting::get('drive_escifor', '') ?? '',
            'multimarca' => Setting::get('drive_multimarca', '') ?? '',
        ];

        return Inertia::render('welcome', [
            'grupos' => $grupos,
            'stats' => $stats,
            'driveLinks' => $driveLinks,
        ]);
    }

    /**
     * Display a specific commerce in the public corporate catalog.
     */
    public function show(string $slug): Response
    {
        $comercio = Comercio::query()
            ->where('slug', $slug)
            ->with([
                'grupo',
                'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                'especialidades' => fn ($q) => $q->latest('id'),
            ])
            ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
            ->firstOrFail();

        $grupos = Grupo::query()
            ->where('activo', true)
            ->with([
                'comercios' => function ($query) {
                    $query->where('activo', true)
                        ->with([
                            'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                            'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'especialidades' => fn ($q) => $q->latest('id'),
                        ])
                        ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
                        ->orderBy('nombre', 'asc');
                },
            ])
            ->orderBy('id', 'asc')
            ->get();

        $stats = [
            'totalGrupos' => Grupo::where('activo', true)->count(),
            'totalComercios' => Comercio::where('activo', true)->count(),
            'totalCarreras' => Carrera::count(),
            'totalDiplomados' => Diplomado::count(),
            'totalCursos' => Curso::count(),
            'totalEspecialidades' => Especialidad::count(),
        ];

        $driveLinks = [
            'escifor' => Setting::get('drive_escifor', '') ?? '',
            'multimarca' => Setting::get('drive_multimarca', '') ?? '',
        ];

        return Inertia::render('welcome', [
            'grupos' => $grupos,
            'initialComercio' => $comercio,
            'stats' => $stats,
            'driveLinks' => $driveLinks,
        ]);
    }
}
