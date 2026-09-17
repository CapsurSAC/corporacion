<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
use App\Models\Estado;
use App\Models\Rubro;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EspecialidadController extends Controller
{
    /**
     * Display a listing of especialidades.
     */
    public function index(Request $request): Response
    {
        $carreraId = $request->query('carrera_id');
        $rubroId = $request->query('rubro_id');
        $comercioId = $request->query('comercio_id');
        $estadoId = $request->query('estado_id');
        $search = $request->query('search');

        $especialidadesQuery = Especialidad::query()
            ->with(['carrera.comercio.grupo', 'rubro', 'estado'])
            ->when($carreraId, fn ($query) => $query->where('carrera_id', $carreraId))
            ->when($rubroId, fn ($query) => $query->where('rubro_id', $rubroId))
            ->when($comercioId, fn ($query) => $query->whereHas('carrera', fn ($q) => $q->where('comercio_id', $comercioId)))
            ->when($estadoId, fn ($query) => $query->where('estado_id', $estadoId))
            ->when($search, fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('precio', 'like', "%{$search}%")
                    ->orWhereHas('carrera', fn ($c) => $c->where('nombre', 'like', "%{$search}%"))
                    ->orWhereHas('rubro', fn ($r) => $r->where('nombre', 'like', "%{$search}%"));
            }))
            ->orderBy('id', 'desc');

        $carreras = Carrera::query()
            ->with('comercio:id,nombre,codigo,sigla,color_hex,logo_modo_claro,logo_modo_oscuro')
            ->select('id', 'comercio_id', 'nombre', 'codigo')
            ->orderBy('nombre')
            ->get();

        $rubros = Rubro::query()
            ->where('activo', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        $comercios = Comercio::query()
            ->select('id', 'nombre', 'codigo', 'sigla', 'color_hex', 'logo_modo_claro', 'logo_modo_oscuro')
            ->orderBy('nombre')
            ->get();

        $estados = Estado::query()
            ->where('activo', true)
            ->orderBy('orden')
            ->get();

        return Inertia::render('admin/especialidades/index', [
            'especialidades' => $especialidadesQuery->get(),
            'carreras' => $carreras,
            'rubros' => $rubros,
            'comercios' => $comercios,
            'estados' => $estados,
            'filters' => [
                'carrera_id' => $carreraId,
                'rubro_id' => $rubroId,
                'comercio_id' => $comercioId,
                'estado_id' => $estadoId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created especialidad in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->filled('estado') && ! $request->filled('estado_id')) {
            $request->merge(['estado_id' => $request->input('estado')]);
        }

        $validated = $request->validate([
            'carrera_id' => ['required', 'exists:carreras,id'],
            'rubro_id' => ['required', 'exists:rubros,id'],
            'estado_id' => ['nullable', 'exists:estados,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ], [
            'carrera_id.required' => 'Debes seleccionar la carrera a la que pertenece esta especialidad.',
            'carrera_id.exists' => 'La carrera seleccionada no es válida.',
            'rubro_id.required' => 'Debes seleccionar obligatoriamente un rubro para esta especialidad.',
            'rubro_id.exists' => 'El rubro seleccionado no es válido.',
            'estado_id.exists' => 'El estado seleccionado no es válido.',
            'nombre.required' => 'El nombre de la especialidad es obligatorio.',
            'nombre.min' => 'El nombre de la especialidad debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre de la especialidad no puede superar los 255 caracteres.',
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Especialidad::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Especialidad::create([
            'carrera_id' => $validated['carrera_id'],
            'rubro_id' => $validated['rubro_id'],
            'estado_id' => $validated['estado_id'] ?? null,
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'youtube' => !empty($validated['youtube']) ? trim($validated['youtube']) : null,
            'precio' => !empty($validated['precio']) ? trim($validated['precio']) : null,
            'actualizado_drive' => !empty($validated['actualizado_drive']) ? trim($validated['actualizado_drive']) : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Especialidad registrada con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified especialidad in storage.
     */
    public function update(Request $request, $especialidad): RedirectResponse
    {
        $especialidadModel = $especialidad instanceof Especialidad ? $especialidad : Especialidad::findOrFail($especialidad);

        if ($request->filled('estado') && ! $request->filled('estado_id')) {
            $request->merge(['estado_id' => $request->input('estado')]);
        }

        $validated = $request->validate([
            'carrera_id' => ['required', 'exists:carreras,id'],
            'rubro_id' => ['required', 'exists:rubros,id'],
            'estado_id' => ['nullable', 'exists:estados,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'flyer' => ['nullable', 'string', 'max:500'],
            'brochure' => ['nullable', 'string', 'max:500'],
            'youtube' => ['nullable', 'string', 'max:500'],
            'precio' => ['nullable', 'string', 'max:100'],
            'actualizado_drive' => ['nullable', 'string', 'max:500'],
        ], [
            'carrera_id.required' => 'Debes seleccionar la carrera a la que pertenece esta especialidad.',
            'carrera_id.exists' => 'La carrera seleccionada no es válida.',
            'rubro_id.required' => 'Debes seleccionar obligatoriamente un rubro para esta especialidad.',
            'rubro_id.exists' => 'El rubro seleccionado no es válido.',
            'estado_id.exists' => 'El estado seleccionado no es válido.',
            'nombre.required' => 'El nombre de la especialidad es obligatorio.',
            'nombre.min' => 'El nombre de la especialidad debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre de la especialidad no puede superar los 255 caracteres.',
        ]);

        $slug = $especialidadModel->slug;
        if ($especialidadModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Especialidad::where('slug', $slug)->where('id', '!=', $especialidadModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $especialidadModel->update([
            'carrera_id' => $validated['carrera_id'],
            'rubro_id' => $validated['rubro_id'],
            'estado_id' => $validated['estado_id'] ?? null,
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'flyer' => !empty($validated['flyer']) ? trim($validated['flyer']) : null,
            'brochure' => !empty($validated['brochure']) ? trim($validated['brochure']) : null,
            'youtube' => !empty($validated['youtube']) ? trim($validated['youtube']) : null,
            'precio' => !empty($validated['precio']) ? trim($validated['precio']) : null,
            'actualizado_drive' => !empty($validated['actualizado_drive']) ? trim($validated['actualizado_drive']) : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Especialidad actualizada correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified especialidad from storage.
     */
    public function destroy(Request $request, $especialidad): RedirectResponse
    {
        $especialidadModel = $especialidad instanceof Especialidad ? $especialidad : Especialidad::findOrFail($especialidad);
        $nombre = $especialidadModel->nombre;
        $especialidadModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "La especialidad \"{$nombre}\" ha sido eliminada correctamente.",
        ]);

        return back();
    }
}
