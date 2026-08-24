<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comercio;
use App\Models\Grupo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ComercioController extends Controller
{
    /**
     * Display a listing of the comercios.
     */
    public function index(Request $request): Response
    {
        $grupoId = $request->query('grupo_id');
        $search = $request->query('search');

        $comerciosQuery = Comercio::query()
            ->with('grupo')
            ->withCount('carreras')
            ->when($grupoId, fn ($query) => $query->where('grupo_id', $grupoId))
            ->when($search, fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('sigla', 'like', "%{$search}%")
                    ->orWhere('resolucion_creacion', 'like', "%{$search}%")
                    ->orWhere('resolucion_revalidacion', 'like', "%{$search}%")
                    ->orWhere('escale_minedu', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            }))
            ->orderBy('grupo_id')
            ->orderBy('nombre');

        $grupos = Grupo::query()
            ->select('id', 'nombre', 'slug', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/comercios/index', [
            'comercios' => $comerciosQuery->get(),
            'grupos' => $grupos,
            'filters' => [
                'grupo_id' => $grupoId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified comercio.
     */
    public function edit(Request $request, string $current_team, $comercio): Response
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);
        $comercioModel->load([
            'grupo',
            'carreras' => fn ($q) => $q->with(['diplomados', 'cursos'])->orderBy('nombre', 'asc'),
            'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
            'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
        ]);

        $grupos = Grupo::query()
            ->select('id', 'nombre', 'slug', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/comercios/edit', [
            'comercio' => $comercioModel,
            'grupos' => $grupos,
        ]);
    }

    /**
     * Store a newly created comercio in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grupo_id' => ['required', 'exists:grupos,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'sigla' => ['nullable', 'string', 'max:50'],
            'color_hex' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i'],
            'pagina_web' => ['nullable', 'string', 'max:500'],
            'plataforma_carrera' => ['nullable', 'string', 'max:500'],
            'certificado_url' => ['nullable', 'string', 'max:500'],
            'resolucion_revalidacion' => ['nullable', 'string', 'max:255'],
            'resolucion_creacion' => ['nullable', 'string', 'max:255'],
            'escale_minedu' => ['nullable', 'string', 'max:255'],
            'link_directo_escale' => ['nullable', 'string', 'max:500'],
            'malla_curricular_url' => ['nullable', 'string', 'max:500'],
            'catalogo_url' => ['nullable', 'string', 'max:500'],
            'como_ingresar_plataforma' => ['nullable', 'string', 'max:500'],
            'reconocimiento_director' => ['nullable', 'string', 'max:500'],
            'seminario' => ['nullable', 'string', 'max:500'],
            'convenio' => ['nullable', 'string', 'max:1000'],
            'promocion_vigente' => ['nullable', 'string', 'max:1000'],
            'canales_youtube' => ['nullable', 'array'],
            'canales_youtube.*' => ['nullable', 'string', 'max:500'],
            'fotos' => ['nullable', 'array'],
            'fotos.*' => ['nullable', 'string', 'max:500'],
            'custom_attributes' => ['nullable', 'array'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Comercio::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $canalesYoutube = array_values(array_filter($request->input('canales_youtube', []) ?? []));
        $fotos = array_values(array_filter($request->input('fotos', []) ?? []));

        Comercio::create([
            'grupo_id' => $validated['grupo_id'],
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'codigo' => $validated['codigo'] ?? null,
            'sigla' => $validated['sigla'] ?? null,
            'color_hex' => $validated['color_hex'] ?? '#1d4ed8',
            'pagina_web' => $validated['pagina_web'] ?? null,
            'plataforma_carrera' => $validated['plataforma_carrera'] ?? null,
            'certificado_url' => $validated['certificado_url'] ?? null,
            'resolucion_revalidacion' => $validated['resolucion_revalidacion'] ?? null,
            'resolucion_creacion' => $validated['resolucion_creacion'] ?? null,
            'escale_minedu' => $validated['escale_minedu'] ?? null,
            'link_directo_escale' => $validated['link_directo_escale'] ?? null,
            'malla_curricular_url' => $validated['malla_curricular_url'] ?? null,
            'catalogo_url' => $validated['catalogo_url'] ?? null,
            'como_ingresar_plataforma' => $validated['como_ingresar_plataforma'] ?? null,
            'reconocimiento_director' => $validated['reconocimiento_director'] ?? null,
            'seminario' => $validated['seminario'] ?? null,
            'convenio' => $validated['convenio'] ?? null,
            'promocion_vigente' => $validated['promocion_vigente'] ?? null,
            'canales_youtube' => $canalesYoutube,
            'fotos' => $fotos,
            'custom_attributes' => $request->input('custom_attributes', null),
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Comercio registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified comercio in storage.
     */
    public function update(Request $request, string $current_team, $comercio): RedirectResponse
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);

        $validated = $request->validate([
            'grupo_id' => ['required', 'exists:grupos,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'sigla' => ['nullable', 'string', 'max:50'],
            'color_hex' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i'],
            'pagina_web' => ['nullable', 'string', 'max:500'],
            'plataforma_carrera' => ['nullable', 'string', 'max:500'],
            'certificado_url' => ['nullable', 'string', 'max:500'],
            'resolucion_revalidacion' => ['nullable', 'string', 'max:255'],
            'resolucion_creacion' => ['nullable', 'string', 'max:255'],
            'escale_minedu' => ['nullable', 'string', 'max:255'],
            'link_directo_escale' => ['nullable', 'string', 'max:500'],
            'malla_curricular_url' => ['nullable', 'string', 'max:500'],
            'catalogo_url' => ['nullable', 'string', 'max:500'],
            'como_ingresar_plataforma' => ['nullable', 'string', 'max:500'],
            'reconocimiento_director' => ['nullable', 'string', 'max:500'],
            'seminario' => ['nullable', 'string', 'max:500'],
            'convenio' => ['nullable', 'string', 'max:1000'],
            'promocion_vigente' => ['nullable', 'string', 'max:1000'],
            'canales_youtube' => ['nullable', 'array'],
            'canales_youtube.*' => ['nullable', 'string', 'max:500'],
            'fotos' => ['nullable', 'array'],
            'fotos.*' => ['nullable', 'string', 'max:500'],
            'custom_attributes' => ['nullable', 'array'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
        ]);

        $slug = $comercioModel->slug;
        if ($comercioModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Comercio::where('slug', $slug)->where('id', '!=', $comercioModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $canalesYoutube = array_values(array_filter($request->input('canales_youtube', []) ?? []));
        $fotos = array_values(array_filter($request->input('fotos', []) ?? []));

        $comercioModel->update([
            'grupo_id' => $validated['grupo_id'],
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'codigo' => $validated['codigo'] ?? null,
            'sigla' => $validated['sigla'] ?? null,
            'color_hex' => $validated['color_hex'] ?? $comercioModel->color_hex,
            'pagina_web' => $validated['pagina_web'] ?? null,
            'plataforma_carrera' => $validated['plataforma_carrera'] ?? null,
            'certificado_url' => $validated['certificado_url'] ?? null,
            'resolucion_revalidacion' => $validated['resolucion_revalidacion'] ?? null,
            'resolucion_creacion' => $validated['resolucion_creacion'] ?? null,
            'escale_minedu' => $validated['escale_minedu'] ?? null,
            'link_directo_escale' => $validated['link_directo_escale'] ?? null,
            'malla_curricular_url' => $validated['malla_curricular_url'] ?? null,
            'catalogo_url' => $validated['catalogo_url'] ?? null,
            'como_ingresar_plataforma' => $validated['como_ingresar_plataforma'] ?? null,
            'reconocimiento_director' => $validated['reconocimiento_director'] ?? null,
            'seminario' => $validated['seminario'] ?? null,
            'convenio' => $validated['convenio'] ?? null,
            'promocion_vigente' => $validated['promocion_vigente'] ?? null,
            'canales_youtube' => $canalesYoutube,
            'fotos' => $fotos,
            'custom_attributes' => $request->input('custom_attributes', null),
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Comercio actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified comercio from storage.
     */
    public function destroy(Request $request, string $current_team, $comercio): RedirectResponse
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);
        $nombre = $comercioModel->nombre;
        $comercioModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "El comercio \"{$nombre}\" ha sido eliminado.",
        ]);

        return back();
    }
}
