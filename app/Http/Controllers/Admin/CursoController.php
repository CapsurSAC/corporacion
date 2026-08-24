<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Grupo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CursoController extends Controller
{
    /**
     * Display a listing of cursos.
     */
    public function index(Request $request): Response
    {
        $comercioId = $request->input('comercio_id');
        $tipo = $request->input('tipo');
        $search = $request->input('search');

        $cursosQuery = Curso::query()
            ->with([
                'comercio' => function ($query) {
                    $query->select('id', 'grupo_id', 'nombre', 'slug', 'codigo', 'color_hex')
                        ->with('grupo:id,nombre');
                },
                'carrera:id,comercio_id,nombre,codigo',
            ])
            ->when($comercioId && $comercioId !== 'all', function ($query) use ($comercioId) {
                $query->where('comercio_id', $comercioId);
            })
            ->when($tipo && $tipo !== 'all', function ($query) use ($tipo) {
                if ($tipo === 'sin_categoria' || $tipo === 'none') {
                    $query->where(function ($q) {
                        $q->whereNull('tipo')->orWhere('tipo', '');
                    });
                } else {
                    $query->where('tipo', $tipo);
                }
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                        ->orWhere('precio', 'like', "%{$search}%");
                });
            })
            ->orderBy('tipo', 'asc')
            ->orderBy('id', 'asc');

        $comercios = Comercio::query()
            ->with('grupo:id,nombre')
            ->select('id', 'grupo_id', 'nombre', 'codigo', 'color_hex', 'activo')
            ->orderBy('grupo_id')
            ->orderBy('nombre')
            ->get();

        $carreras = \App\Models\Carrera::query()
            ->select('id', 'comercio_id', 'nombre', 'codigo')
            ->orderBy('nombre')
            ->get();

        $grupos = Grupo::query()
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/cursos/index', [
            'cursos' => $cursosQuery->get(),
            'comercios' => $comercios,
            'carreras' => $carreras,
            'grupos' => $grupos,
            'filters' => [
                'comercio_id' => $comercioId,
                'tipo' => $tipo,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created curso in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:100'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Curso::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Curso::create([
            'comercio_id' => $validated['comercio_id'],
            'carrera_id' => $validated['carrera_id'] ?? null,
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'tipo' => !empty($validated['tipo']) ? $validated['tipo'] : null,
            'flyer' => $validated['flyer'] ?? null,
            'brochure' => $validated['brochure'] ?? null,
            'youtube' => $validated['youtube'] ?? null,
            'precio' => $validated['precio'] ?? null,
            'actualizado_drive' => $validated['actualizado_drive'] ?? null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Curso registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified curso in storage.
     */
    public function update(Request $request, string $current_team, $curso): RedirectResponse
    {
        $cursoModel = $curso instanceof Curso ? $curso : Curso::findOrFail($curso);

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:100'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ]);

        $slug = $cursoModel->slug;
        if ($cursoModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Curso::where('slug', $slug)->where('id', '!=', $cursoModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $cursoModel->update([
            'comercio_id' => $validated['comercio_id'],
            'carrera_id' => $validated['carrera_id'] ?? null,
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'tipo' => !empty($validated['tipo']) ? $validated['tipo'] : null,
            'flyer' => $validated['flyer'] ?? null,
            'brochure' => $validated['brochure'] ?? null,
            'youtube' => $validated['youtube'] ?? null,
            'precio' => $validated['precio'] ?? null,
            'actualizado_drive' => $validated['actualizado_drive'] ?? null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Curso actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified curso from storage.
     */
    public function destroy(Request $request, string $current_team, $curso): RedirectResponse
    {
        $cursoModel = $curso instanceof Curso ? $curso : Curso::findOrFail($curso);
        $nombre = $cursoModel->nombre;
        $cursoModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Curso \"{$nombre}\" eliminado con éxito.",
        ]);

        return back();
    }
}
