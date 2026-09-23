<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GrupoController extends Controller
{
    /**
     * Display a listing of the grupos.
     */
    public function index(): Response
    {
        $grupos = Grupo::query()
            ->with(['comercios' => function ($q) {
                $q->select('id', 'grupo_id', 'nombre', 'sigla', 'color_hex', 'activo')
                  ->orderBy('nombre');
            }])
            ->withCount(['comercios', 'carreras'])
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/grupos/index', [
            'grupos' => $grupos,
        ]);
    }

    /**
     * Store a newly created grupo.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:3', 'max:255', 'unique:grupos,nombre'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
        ], [
            'nombre.required' => 'El nombre del grupo comercial es obligatorio.',
            'nombre.min' => 'El nombre del grupo debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del grupo no puede superar los 255 caracteres.',
            'nombre.unique' => 'Ya existe un grupo comercial registrado con este nombre.',
            'descripcion.max' => 'La descripción no puede exceder los 1000 caracteres.',
        ]);

        $slug = Str::slug($validated['nombre']);
        $originalSlug = $slug;
        $counter = 1;
        while (Grupo::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Grupo::create([
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $request->boolean('activo', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Grupo comercial registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified grupo.
     */
    public function update(Request $request, $grupo): RedirectResponse
    {
        $grupoModel = $grupo instanceof Grupo ? $grupo : Grupo::findOrFail($grupo);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:3', 'max:255', Rule::unique('grupos', 'nombre')->ignore($grupoModel->id)],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
        ], [
            'nombre.required' => 'El nombre del grupo comercial es obligatorio.',
            'nombre.min' => 'El nombre del grupo debe tener al menos 3 caracteres.',
            'nombre.max' => 'El nombre del grupo no puede superar los 255 caracteres.',
            'nombre.unique' => 'Ya existe otro grupo comercial con este nombre.',
            'descripcion.max' => 'La descripción no puede exceder los 1000 caracteres.',
        ]);

        $slug = $grupoModel->slug;
        if ($grupoModel->nombre !== $validated['nombre']) {
            $slug = Str::slug($validated['nombre']);
            $originalSlug = $slug;
            $counter = 1;
            while (Grupo::where('slug', $slug)->where('id', '!=', $grupoModel->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
        }

        $grupoModel->update([
            'nombre' => trim($validated['nombre']),
            'slug' => $slug,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $request->boolean('activo', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Grupo comercial actualizado con éxito.',
        ]);

        return back();
    }

    /**
     * Remove the specified grupo.
     */
    public function destroy(Request $request, $grupo): RedirectResponse
    {
        $grupoModel = $grupo instanceof Grupo ? $grupo : Grupo::findOrFail($grupo);
        $grupoModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Grupo comercial eliminado con éxito.',
        ]);

        return back();
    }
}
