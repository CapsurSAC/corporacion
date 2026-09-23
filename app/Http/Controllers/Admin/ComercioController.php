<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comercio;
use App\Models\Estado;
use App\Models\Grupo;
use App\Models\Rubro;
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
            ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
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
    public function edit(Request $request, $comercio): Response
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);
        $comercioModel->load([
            'grupo',
            'carreras' => fn ($q) => $q->with(['diplomados.estado', 'cursos.estado', 'especialidades.rubro', 'especialidades.estado'])->orderBy('nombre', 'asc'),
            'cursos' => fn ($q) => $q->with('estado')->orderBy('tipo', 'asc')->latest('id'),
            'diplomados' => fn ($q) => $q->with('estado')->orderBy('tipo', 'asc')->latest('id'),
            'especialidades' => fn ($q) => $q->with(['carrera', 'rubro', 'estado'])->latest('id'),
        ]);

        $grupos = Grupo::query()
            ->select('id', 'nombre', 'slug', 'activo')
            ->orderBy('nombre')
            ->get();

        $estados = Estado::query()
            ->where('activo', true)
            ->orderBy('orden')
            ->get();

        return Inertia::render('admin/comercios/edit', [
            'comercio' => $comercioModel,
            'grupos' => $grupos,
            'estados' => $estados,
            'rubros' => Rubro::where('activo', true)->orderBy('orden')->orderBy('nombre')->get(),
        ]);
    }

    /**
     * Store a newly created comercio in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grupo_id' => ['required', 'exists:grupos,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'sigla' => ['nullable', 'string', 'max:50'],
            'color_hex' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i'],
            'logo_modo_claro' => ['nullable', 'string', 'max:500'],
            'logo_modo_oscuro' => ['nullable', 'string', 'max:500'],
            'pagina_web' => ['nullable', 'string', 'max:500'],
            'plataforma_carrera' => ['nullable', 'string', 'max:500'],
            'certificado_url' => ['nullable', 'string', 'max:500'],
            'resolucion_revalidacion' => ['nullable', 'string', 'max:255'],
            'resolucion_creacion' => ['nullable', 'string', 'max:255'],
            'escale_minedu' => ['nullable', 'string', 'max:255'],
            'link_directo_escale' => ['nullable', 'string', 'max:500'],
            'malla_curricular_url' => ['nullable', 'string', 'max:500'],
            'catalogo_url' => ['nullable', 'string', 'max:500'],
            'brochure_vacaciones_utiles' => ['nullable', 'string', 'max:500'],
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
        ], [
            'grupo_id.required' => 'Debes seleccionar un grupo corporativo.',
            'grupo_id.exists' => 'El grupo seleccionado no es válido.',
            'nombre.required' => 'El nombre institucional del comercio es obligatorio.',
            'nombre.min' => 'El nombre del comercio debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del comercio no puede exceder los 255 caracteres.',
            'color_hex.regex' => 'El código de color debe tener un formato hexadecimal válido (ej. #0c43a3).',
            'descripcion.max' => 'La descripción no puede exceder los 1000 caracteres.',
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
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'codigo' => !empty($validated['codigo']) ? trim($validated['codigo']) : null,
            'sigla' => !empty($validated['sigla']) ? trim($validated['sigla']) : null,
            'color_hex' => $validated['color_hex'] ?? '#1d4ed8',
            'logo_modo_claro' => !empty($validated['logo_modo_claro']) ? trim($validated['logo_modo_claro']) : null,
            'logo_modo_oscuro' => !empty($validated['logo_modo_oscuro']) ? trim($validated['logo_modo_oscuro']) : null,
            'pagina_web' => !empty($validated['pagina_web']) ? trim($validated['pagina_web']) : null,
            'plataforma_carrera' => !empty($validated['plataforma_carrera']) ? trim($validated['plataforma_carrera']) : null,
            'certificado_url' => !empty($validated['certificado_url']) ? trim($validated['certificado_url']) : null,
            'resolucion_revalidacion' => !empty($validated['resolucion_revalidacion']) ? trim($validated['resolucion_revalidacion']) : null,
            'resolucion_creacion' => !empty($validated['resolucion_creacion']) ? trim($validated['resolucion_creacion']) : null,
            'escale_minedu' => !empty($validated['escale_minedu']) ? trim($validated['escale_minedu']) : null,
            'link_directo_escale' => !empty($validated['link_directo_escale']) ? trim($validated['link_directo_escale']) : null,
            'malla_curricular_url' => !empty($validated['malla_curricular_url']) ? trim($validated['malla_curricular_url']) : null,
            'catalogo_url' => !empty($validated['catalogo_url']) ? trim($validated['catalogo_url']) : null,
            'brochure_vacaciones_utiles' => !empty($validated['brochure_vacaciones_utiles']) ? trim($validated['brochure_vacaciones_utiles']) : null,
            'como_ingresar_plataforma' => !empty($validated['como_ingresar_plataforma']) ? trim($validated['como_ingresar_plataforma']) : null,
            'reconocimiento_director' => !empty($validated['reconocimiento_director']) ? trim($validated['reconocimiento_director']) : null,
            'seminario' => !empty($validated['seminario']) ? trim($validated['seminario']) : null,
            'convenio' => !empty($validated['convenio']) ? trim($validated['convenio']) : null,
            'promocion_vigente' => !empty($validated['promocion_vigente']) ? trim($validated['promocion_vigente']) : null,
            'canales_youtube' => $canalesYoutube,
            'fotos' => $fotos,
            'custom_attributes' => $request->input('custom_attributes', null),
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $request->boolean('activo', true),
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
    public function update(Request $request, $comercio): RedirectResponse
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);

        $validated = $request->validate([
            'grupo_id' => ['required', 'exists:grupos,id'],
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:50'],
            'sigla' => ['nullable', 'string', 'max:50'],
            'color_hex' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/i'],
            'logo_modo_claro' => ['nullable', 'string', 'max:500'],
            'logo_modo_oscuro' => ['nullable', 'string', 'max:500'],
            'pagina_web' => ['nullable', 'string', 'max:500'],
            'plataforma_carrera' => ['nullable', 'string', 'max:500'],
            'certificado_url' => ['nullable', 'string', 'max:500'],
            'resolucion_revalidacion' => ['nullable', 'string', 'max:255'],
            'resolucion_creacion' => ['nullable', 'string', 'max:255'],
            'escale_minedu' => ['nullable', 'string', 'max:255'],
            'link_directo_escale' => ['nullable', 'string', 'max:500'],
            'malla_curricular_url' => ['nullable', 'string', 'max:500'],
            'catalogo_url' => ['nullable', 'string', 'max:500'],
            'brochure_vacaciones_utiles' => ['nullable', 'string', 'max:500'],
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
        ], [
            'grupo_id.required' => 'Debes seleccionar un grupo corporativo.',
            'grupo_id.exists' => 'El grupo seleccionado no es válido.',
            'nombre.required' => 'El nombre institucional del comercio es obligatorio.',
            'nombre.min' => 'El nombre del comercio debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del comercio no puede exceder los 255 caracteres.',
            'color_hex.regex' => 'El código de color debe tener un formato hexadecimal válido (ej. #0c43a3).',
            'descripcion.max' => 'La descripción no puede exceder los 1000 caracteres.',
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
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'codigo' => !empty($validated['codigo']) ? trim($validated['codigo']) : null,
            'sigla' => !empty($validated['sigla']) ? trim($validated['sigla']) : null,
            'color_hex' => $validated['color_hex'] ?? $comercioModel->color_hex,
            'logo_modo_claro' => $request->has('logo_modo_claro') ? (!empty($validated['logo_modo_claro']) ? trim($validated['logo_modo_claro']) : null) : $comercioModel->logo_modo_claro,
            'logo_modo_oscuro' => $request->has('logo_modo_oscuro') ? (!empty($validated['logo_modo_oscuro']) ? trim($validated['logo_modo_oscuro']) : null) : $comercioModel->logo_modo_oscuro,
            'pagina_web' => !empty($validated['pagina_web']) ? trim($validated['pagina_web']) : null,
            'plataforma_carrera' => !empty($validated['plataforma_carrera']) ? trim($validated['plataforma_carrera']) : null,
            'certificado_url' => !empty($validated['certificado_url']) ? trim($validated['certificado_url']) : null,
            'resolucion_revalidacion' => !empty($validated['resolucion_revalidacion']) ? trim($validated['resolucion_revalidacion']) : null,
            'resolucion_creacion' => !empty($validated['resolucion_creacion']) ? trim($validated['resolucion_creacion']) : null,
            'escale_minedu' => !empty($validated['escale_minedu']) ? trim($validated['escale_minedu']) : null,
            'link_directo_escale' => !empty($validated['link_directo_escale']) ? trim($validated['link_directo_escale']) : null,
            'malla_curricular_url' => !empty($validated['malla_curricular_url']) ? trim($validated['malla_curricular_url']) : null,
            'catalogo_url' => !empty($validated['catalogo_url']) ? trim($validated['catalogo_url']) : null,
            'brochure_vacaciones_utiles' => !empty($validated['brochure_vacaciones_utiles']) ? trim($validated['brochure_vacaciones_utiles']) : null,
            'como_ingresar_plataforma' => !empty($validated['como_ingresar_plataforma']) ? trim($validated['como_ingresar_plataforma']) : null,
            'reconocimiento_director' => !empty($validated['reconocimiento_director']) ? trim($validated['reconocimiento_director']) : null,
            'seminario' => !empty($validated['seminario']) ? trim($validated['seminario']) : null,
            'convenio' => !empty($validated['convenio']) ? trim($validated['convenio']) : null,
            'promocion_vigente' => !empty($validated['promocion_vigente']) ? trim($validated['promocion_vigente']) : null,
            'canales_youtube' => $canalesYoutube,
            'fotos' => $fotos,
            'custom_attributes' => $request->input('custom_attributes', null),
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $request->boolean('activo', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Comercio actualizado con éxito.',
        ]);

        return back();
    }

    /**
     * Remove the specified comercio from storage.
     */
    public function destroy(Request $request, $comercio): RedirectResponse
    {
        $comercioModel = $comercio instanceof Comercio ? $comercio : Comercio::findOrFail($comercio);
        $comercioModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Comercio eliminado con éxito.',
        ]);

        return back();
    }
}
