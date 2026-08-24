<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Grupo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CarreraController extends Controller
{
    /**
     * Display a listing of the carreras / programas.
     */
    public function index(Request $request): Response
    {
        $comercioId = $request->query('comercio_id');
        $grupoId = $request->query('grupo_id');
        $tipo = $request->query('tipo');
        $modalidad = $request->query('modalidad');
        $estado = $request->query('estado');
        $search = $request->query('search');

        $carrerasQuery = Carrera::query()
            ->with(['comercio.grupo'])
            ->when($comercioId, fn ($query) => $query->where('comercio_id', $comercioId))
            ->when($grupoId, fn ($query) => $query->whereHas('comercio', fn ($q) => $q->where('grupo_id', $grupoId)))
            ->when($tipo, fn ($query) => $query->where('tipo', $tipo))
            ->when($modalidad, fn ($query) => $query->where('modalidad', $modalidad))
            ->when($estado, fn ($query) => $query->where('estado', $estado))
            ->when($search, fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('url_malla_curricular', 'like', "%{$search}%")
                    ->orWhere('url_declaracion_jurada', 'like', "%{$search}%")
                    ->orWhere('modelo_certificado', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%");
            }))
            ->latest('id');

        $comercios = Comercio::query()
            ->with('grupo:id,nombre')
            ->select('id', 'grupo_id', 'nombre', 'codigo', 'color_hex', 'activo')
            ->orderBy('grupo_id')
            ->orderBy('nombre')
            ->get();

        $grupos = Grupo::query()
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/carreras/index', [
            'carreras' => $carrerasQuery->get(),
            'comercios' => $comercios,
            'grupos' => $grupos,
            'filters' => [
                'comercio_id' => $comercioId,
                'grupo_id' => $grupoId,
                'tipo' => $tipo,
                'modalidad' => $modalidad,
                'estado' => $estado,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created carrera in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'url_malla_curricular' => ['nullable', 'string', 'max:500'],
            'url_declaracion_jurada' => ['nullable', 'string', 'max:500'],
            'modelo_certificado' => ['nullable', 'string', 'max:500'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'tipo' => ['nullable', 'string', 'in:carrera,diplomado,curso,taller,especialidad'],
            'modalidad' => ['nullable', 'string', 'in:virtual,presencial,semipresencial,asincrono'],
            'duracion' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'resolucion' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'modelo_titulo' => ['nullable', 'string', 'max:500'],
            'estado' => ['nullable', 'string', 'in:activo,inactivo,en_convocatoria'],
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Carrera::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Carrera::create([
            'comercio_id' => $validated['comercio_id'],
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'url_malla_curricular' => $validated['url_malla_curricular'] ?? null,
            'url_declaracion_jurada' => $validated['url_declaracion_jurada'] ?? null,
            'modelo_certificado' => $validated['modelo_certificado'] ?? null,
            'codigo' => $validated['codigo'] ?? null,
            'tipo' => $validated['tipo'] ?? 'carrera',
            'modalidad' => $validated['modalidad'] ?? 'virtual',
            'duracion' => $validated['duracion'] ?? '3 años',
            'descripcion' => $validated['descripcion'] ?? null,
            'resolucion' => $validated['resolucion'] ?? null,
            'brochure' => $validated['brochure'] ?? null,
            'flyer' => $validated['flyer'] ?? null,
            'modelo_titulo' => $validated['modelo_titulo'] ?? null,
            'estado' => $validated['estado'] ?? 'activo',
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Programa académico registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified carrera in storage.
     */
    public function update(Request $request, string $current_team, $carrera): RedirectResponse
    {
        $carreraModel = $carrera instanceof Carrera ? $carrera : Carrera::findOrFail($carrera);

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'url_malla_curricular' => ['nullable', 'string', 'max:500'],
            'url_declaracion_jurada' => ['nullable', 'string', 'max:500'],
            'modelo_certificado' => ['nullable', 'string', 'max:500'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'tipo' => ['nullable', 'string', 'in:carrera,diplomado,curso,taller,especialidad'],
            'modalidad' => ['nullable', 'string', 'in:virtual,presencial,semipresencial,asincrono'],
            'duracion' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:2000'],
            'resolucion' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'modelo_titulo' => ['nullable', 'string', 'max:500'],
            'estado' => ['nullable', 'string', 'in:activo,inactivo,en_convocatoria'],
        ]);

        $slug = $carreraModel->slug;
        if ($carreraModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Carrera::where('slug', $slug)->where('id', '!=', $carreraModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $carreraModel->update([
            'comercio_id' => $validated['comercio_id'],
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'url_malla_curricular' => $validated['url_malla_curricular'] ?? null,
            'url_declaracion_jurada' => $validated['url_declaracion_jurada'] ?? null,
            'modelo_certificado' => $validated['modelo_certificado'] ?? null,
            'codigo' => $validated['codigo'] ?? null,
            'tipo' => $validated['tipo'] ?? $carreraModel->tipo,
            'modalidad' => $validated['modalidad'] ?? $carreraModel->modalidad,
            'duracion' => $validated['duracion'] ?? $carreraModel->duracion,
            'descripcion' => $validated['descripcion'] ?? $carreraModel->descripcion,
            'resolucion' => $validated['resolucion'] ?? null,
            'brochure' => $validated['brochure'] ?? null,
            'flyer' => $validated['flyer'] ?? null,
            'modelo_titulo' => $validated['modelo_titulo'] ?? null,
            'estado' => $validated['estado'] ?? $carreraModel->estado,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Programa académico actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified carrera from storage.
     */
    public function destroy(Request $request, string $current_team, $carrera): RedirectResponse
    {
        $carreraModel = $carrera instanceof Carrera ? $carrera : Carrera::findOrFail($carrera);
        $nombre = $carreraModel->nombre;
        $carreraModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "El programa \"{$nombre}\" ha sido eliminado.",
        ]);

        return back();
    }
}
