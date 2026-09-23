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
            ->select('id', 'grupo_id', 'nombre', 'codigo', 'sigla', 'color_hex', 'logo_modo_claro', 'logo_modo_oscuro', 'activo')
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
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
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
        ], [
            'comercio_id.required' => 'Debes seleccionar el comercio o instituto responsable.',
            'comercio_id.exists' => 'El comercio seleccionado no es válido.',
            'nombre.required' => 'El nombre del programa formativo es obligatorio.',
            'nombre.min' => 'El nombre del programa debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del programa no puede superar los 255 caracteres.',
            'tipo.in' => 'El tipo de programa seleccionado no es válido.',
            'modalidad.in' => 'La modalidad seleccionada no es válida.',
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
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'url_malla_curricular' => !empty($validated['url_malla_curricular']) ? trim($validated['url_malla_curricular']) : null,
            'url_declaracion_jurada' => !empty($validated['url_declaracion_jurada']) ? trim($validated['url_declaracion_jurada']) : null,
            'modelo_certificado' => !empty($validated['modelo_certificado']) ? trim($validated['modelo_certificado']) : null,
            'codigo' => !empty($validated['codigo']) ? trim($validated['codigo']) : null,
            'tipo' => $validated['tipo'] ?? 'carrera',
            'modalidad' => $validated['modalidad'] ?? 'virtual',
            'duracion' => !empty($validated['duracion']) ? trim($validated['duracion']) : '3 años',
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'resolucion' => !empty($validated['resolucion']) ? trim($validated['resolucion']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'modelo_titulo' => !empty($validated['modelo_titulo']) ? trim($validated['modelo_titulo']) : null,
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
    public function update(Request $request, $carrera): RedirectResponse
    {
        $carreraModel = $carrera instanceof Carrera ? $carrera : Carrera::findOrFail($carrera);

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
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
        ], [
            'comercio_id.required' => 'Debes seleccionar el comercio o instituto responsable.',
            'comercio_id.exists' => 'El comercio seleccionado no es válido.',
            'nombre.required' => 'El nombre del programa formativo es obligatorio.',
            'nombre.min' => 'El nombre del programa debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del programa no puede superar los 255 caracteres.',
            'tipo.in' => 'El tipo de programa seleccionado no es válido.',
            'modalidad.in' => 'La modalidad seleccionada no es válida.',
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
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'url_malla_curricular' => !empty($validated['url_malla_curricular']) ? trim($validated['url_malla_curricular']) : null,
            'url_declaracion_jurada' => !empty($validated['url_declaracion_jurada']) ? trim($validated['url_declaracion_jurada']) : null,
            'modelo_certificado' => !empty($validated['modelo_certificado']) ? trim($validated['modelo_certificado']) : null,
            'codigo' => !empty($validated['codigo']) ? trim($validated['codigo']) : null,
            'tipo' => $validated['tipo'] ?? $carreraModel->tipo,
            'modalidad' => $validated['modalidad'] ?? $carreraModel->modalidad,
            'duracion' => !empty($validated['duracion']) ? trim($validated['duracion']) : $carreraModel->duracion,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : $carreraModel->descripcion,
            'resolucion' => !empty($validated['resolucion']) ? trim($validated['resolucion']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'modelo_titulo' => !empty($validated['modelo_titulo']) ? trim($validated['modelo_titulo']) : null,
            'estado' => $validated['estado'] ?? $carreraModel->estado,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Carrera actualizada con éxito.',
        ]);

        return back();
    }

    /**
     * Remove the specified carrera from storage.
     */
    public function destroy(Request $request, $carrera): RedirectResponse
    {
        $carreraModel = $carrera instanceof Carrera ? $carrera : Carrera::findOrFail($carrera);
        $carreraModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Carrera eliminada con éxito.',
        ]);

        return back();
    }
}
