<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Estado;
use App\Models\Grupo;
use App\Models\Rubro;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CursoController extends Controller
{
    /**
     * Display a listing of the cursos.
     */
    public function index(Request $request): Response
    {
        $comercioId = $request->query('comercio_id');
        $carreraId = $request->query('carrera_id');
        $estadoId = $request->query('estado_id');
        $rubroId = $request->query('rubro_id');
        $search = $request->query('search');

        $cursosQuery = Curso::query()
            ->with(['comercio.grupo', 'carrera', 'estado', 'rubro'])
            ->when($comercioId, fn ($query) => $query->where('comercio_id', $comercioId))
            ->when($carreraId, function ($query, $carreraId) {
                if ($carreraId === 'no_corresponde' || $carreraId === 'sin_carrera' || $carreraId === 'directa') {
                    $query->whereNull('carrera_id');
                } else {
                    $query->where('carrera_id', $carreraId);
                }
            })
            ->when($estadoId, fn ($query) => $query->where('estado_id', $estadoId))
            ->when($rubroId, function ($query, $rubroId) {
                if ($rubroId === 'sin_categoria') {
                    $query->whereNull('rubro_id');
                } else {
                    $query->where('rubro_id', $rubroId);
                }
            })
            ->when($search, fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('precio', 'like', "%{$search}%");
            }))
            ->orderBy('id', 'desc');

        $comercios = Comercio::query()
            ->with('grupo:id,nombre')
            ->select('id', 'grupo_id', 'nombre', 'codigo', 'sigla', 'color_hex', 'logo_modo_claro', 'logo_modo_oscuro', 'activo')
            ->orderBy('grupo_id')
            ->orderBy('nombre')
            ->get();

        $carreras = Carrera::query()
            ->select('id', 'comercio_id', 'nombre')
            ->orderBy('nombre')
            ->get();

        $grupos = Grupo::query()
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        $estados = Estado::query()
            ->where('activo', true)
            ->orderBy('orden')
            ->get();

        return Inertia::render('admin/cursos/index', [
            'cursos' => $cursosQuery->get(),
            'comercios' => $comercios,
            'carreras' => $carreras,
            'grupos' => $grupos,
            'estados' => $estados,
            'rubros' => Rubro::where('activo', true)->orderBy('orden')->orderBy('nombre')->get(),
            'filters' => [
                'comercio_id' => $comercioId,
                'carrera_id' => $carreraId,
                'estado_id' => $estadoId,
                'rubro_id' => $rubroId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created curso in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->filled('rubros') && ! $request->filled('tipo')) {
            $request->merge(['tipo' => $request->input('rubros')]);
        }

        if ($request->filled('estado') && ! $request->filled('estado_id')) {
            $request->merge(['estado_id' => $request->input('estado')]);
        }

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
            'rubro_id' => ['nullable', 'exists:rubros,id'],
            'estado_id' => ['nullable', 'exists:estados,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:100'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ], [
            'comercio_id.required' => 'Debes seleccionar el comercio o instituto responsable.',
            'comercio_id.exists' => 'El comercio seleccionado no es válido.',
            'carrera_id.exists' => 'La carrera asociada seleccionada no es válida.',
            'rubro_id.exists' => 'El rubro seleccionado no es válido.',
            'estado_id.exists' => 'El estado seleccionado no es válido.',
            'nombre.required' => 'El nombre del curso es obligatorio.',
            'nombre.min' => 'El nombre del curso debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del curso no puede superar los 255 caracteres.',
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
            'rubro_id' => $validated['rubro_id'] ?? null,
            'estado_id' => $validated['estado_id'] ?? null,
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'tipo' => !empty($validated['tipo']) ? trim($validated['tipo']) : null,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'youtube' => !empty($validated['youtube']) ? trim($validated['youtube']) : null,
            'precio' => !empty($validated['precio']) ? trim($validated['precio']) : null,
            'actualizado_drive' => !empty($validated['actualizado_drive']) ? trim($validated['actualizado_drive']) : null,
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
    public function update(Request $request, $curso): RedirectResponse
    {
        $cursoModel = $curso instanceof Curso ? $curso : Curso::findOrFail($curso);

        if ($request->filled('rubros') && ! $request->filled('tipo')) {
            $request->merge(['tipo' => $request->input('rubros')]);
        }

        if ($request->filled('estado') && ! $request->filled('estado_id')) {
            $request->merge(['estado_id' => $request->input('estado')]);
        }

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
            'rubro_id' => ['nullable', 'exists:rubros,id'],
            'estado_id' => ['nullable', 'exists:estados,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'tipo' => ['nullable', 'string', 'max:100'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ], [
            'comercio_id.required' => 'Debes seleccionar el comercio o instituto responsable.',
            'comercio_id.exists' => 'El comercio seleccionado no es válido.',
            'carrera_id.exists' => 'La carrera asociada seleccionada no es válida.',
            'rubro_id.exists' => 'El rubro seleccionado no es válido.',
            'estado_id.exists' => 'El estado seleccionado no es válido.',
            'nombre.required' => 'El nombre del curso es obligatorio.',
            'nombre.min' => 'El nombre del curso debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del curso no puede superar los 255 caracteres.',
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
            'rubro_id' => $validated['rubro_id'] ?? null,
            'estado_id' => $validated['estado_id'] ?? null,
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'tipo' => !empty($validated['tipo']) ? trim($validated['tipo']) : null,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'youtube' => !empty($validated['youtube']) ? trim($validated['youtube']) : null,
            'precio' => !empty($validated['precio']) ? trim($validated['precio']) : null,
            'actualizado_drive' => !empty($validated['actualizado_drive']) ? trim($validated['actualizado_drive']) : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Curso actualizado con éxito.',
        ]);

        return back();
    }

    /**
     * Remove the specified curso from storage.
     */
    public function destroy(Request $request, $curso): RedirectResponse
    {
        $cursoModel = $curso instanceof Curso ? $curso : Curso::findOrFail($curso);
        $cursoModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Curso eliminado con éxito.',
        ]);

        return back();
    }
}
