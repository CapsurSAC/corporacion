<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Especialidad;
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
        $search = $request->query('search');

        $especialidadesQuery = Especialidad::query()
            ->with(['carrera.comercio.grupo', 'rubro'])
            ->when($carreraId, fn ($query) => $query->where('carrera_id', $carreraId))
            ->when($rubroId, fn ($query) => $query->where('rubro_id', $rubroId))
            ->when($comercioId, fn ($query) => $query->whereHas('carrera', fn ($q) => $q->where('comercio_id', $comercioId)))
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

        return Inertia::render('admin/especialidades/index', [
            'especialidades' => $especialidadesQuery->get(),
            'carreras' => $carreras,
            'rubros' => $rubros,
            'comercios' => $comercios,
            'filters' => [
                'carrera_id' => $carreraId,
                'rubro_id' => $rubroId,
                'comercio_id' => $comercioId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created especialidad in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'carrera_id' => ['required', 'exists:carreras,id'],
            'rubro_id' => ['required', 'exists:rubros,id'],
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

        $validated = $request->validate([
            'carrera_id' => ['required', 'exists:carreras,id'],
            'rubro_id' => ['required', 'exists:rubros,id'],
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
