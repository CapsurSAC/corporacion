<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Diplomado;
use App\Models\Grupo;
use App\Models\Rubro;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DiplomadoController extends Controller
{
    /**
     * Display a listing of the diplomados.
     */
    public function index(Request $request): Response
    {
        $comercioId = $request->query('comercio_id');
        $carreraId = $request->query('carrera_id');
        $tipo = $request->query('tipo');
        $search = $request->query('search');

        $diplomadosQuery = Diplomado::query()
            ->with(['comercio.grupo', 'carrera'])
            ->when($comercioId, fn ($query) => $query->where('comercio_id', $comercioId))
            ->when($carreraId, fn ($query) => $query->where('carrera_id', $carreraId))
            ->when($tipo, fn ($query) => $query->where('tipo', $tipo))
            ->when($search, fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('tipo', 'like', "%{$search}%")
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

        return Inertia::render('admin/diplomados/index', [
            'diplomados' => $diplomadosQuery->get(),
            'comercios' => $comercios,
            'carreras' => $carreras,
            'grupos' => $grupos,
            'rubros' => Rubro::where('activo', true)->orderBy('orden')->orderBy('nombre')->get(),
            'filters' => [
                'comercio_id' => $comercioId,
                'carrera_id' => $carreraId,
                'tipo' => $tipo,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created diplomado in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
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
            'nombre.required' => 'El nombre del diplomado es obligatorio.',
            'nombre.min' => 'El nombre del diplomado debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del diplomado no puede exceder los 255 caracteres.',
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Diplomado::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Diplomado::create([
            'comercio_id' => $validated['comercio_id'],
            'carrera_id' => $validated['carrera_id'] ?? null,
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
            'message' => 'Diplomado registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified diplomado in storage.
     */
    public function update(Request $request, $diplomado): RedirectResponse
    {
        $diplomadoModel = $diplomado instanceof Diplomado ? $diplomado : Diplomado::findOrFail($diplomado);

        $validated = $request->validate([
            'comercio_id' => ['required', 'exists:comercios,id'],
            'carrera_id' => ['nullable', 'exists:carreras,id'],
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
            'nombre.required' => 'El nombre del diplomado es obligatorio.',
            'nombre.min' => 'El nombre del diplomado debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del diplomado no puede exceder los 255 caracteres.',
        ]);

        $slug = $diplomadoModel->slug;
        if ($diplomadoModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Diplomado::where('slug', $slug)->where('id', '!=', $diplomadoModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $diplomadoModel->update([
            'comercio_id' => $validated['comercio_id'],
            'carrera_id' => $validated['carrera_id'] ?? null,
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
            'message' => 'Diplomado actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified diplomado from storage.
     */
    public function destroy(Request $request, $diplomado): RedirectResponse
    {
        $diplomadoModel = $diplomado instanceof Diplomado ? $diplomado : Diplomado::findOrFail($diplomado);
        $nombre = $diplomadoModel->nombre;
        $diplomadoModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Diplomado \"{$nombre}\" eliminado con éxito.",
        ]);

        return back();
    }
}
