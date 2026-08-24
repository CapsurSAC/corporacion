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
            'nombre' => ['required', 'string', 'max:255', 'unique:grupos,nombre'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
        ]);

        $slug = Str::slug($validated['nombre']);
        // Ensure slug uniqueness
        $originalSlug = $slug;
        $counter = 1;
        while (Grupo::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        Grupo::create([
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $request->boolean('activo', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Grupo comercial creado correctamente.',
        ]);

        return back();
    }

    /**
     * Update the specified grupo.
     */
    public function update(Request $request, string $current_team, $grupo): RedirectResponse
    {
        $grupoModel = $grupo instanceof Grupo ? $grupo : Grupo::findOrFail($grupo);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', Rule::unique('grupos', 'nombre')->ignore($grupoModel->id)],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'activo' => ['boolean'],
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
            'nombre' => $validated['nombre'],
            'slug' => $slug,
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $request->boolean('activo', true),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Grupo comercial actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified grupo.
     */
    public function destroy(Request $request, string $current_team, $grupo): RedirectResponse
    {
        $grupoModel = $grupo instanceof Grupo ? $grupo : Grupo::findOrFail($grupo);
        $nombre = $grupoModel->nombre;
        $grupoModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "El grupo \"{$nombre}\" ha sido eliminado.",
        ]);

        return back();
    }
}
