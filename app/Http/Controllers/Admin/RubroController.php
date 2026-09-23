<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rubro;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RubroController extends Controller
{
    /**
     * Display a listing of rubros.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $categoria = $request->query('categoria');
        $activo = $request->query('activo');

        $rubrosQuery = Rubro::query()
            ->withCount(['diplomados', 'cursos', 'especialidades'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                        ->orWhere('clave', 'like', "%{$search}%")
                        ->orWhere('categoria', 'like', "%{$search}%")
                        ->orWhere('descripcion', 'like', "%{$search}%");
                });
            })
            ->when($categoria && $categoria !== 'all', function ($query) use ($categoria) {
                $query->where('categoria', $categoria);
            })
            ->when($activo !== null && $activo !== '' && $activo !== 'all', function ($query) use ($activo) {
                $query->where('activo', filter_var($activo, FILTER_VALIDATE_BOOLEAN));
            })
            ->orderBy('orden', 'asc')
            ->orderBy('nombre', 'asc');

        $categorias = Rubro::query()
            ->whereNotNull('categoria')
            ->where('categoria', '!=', '')
            ->distinct()
            ->pluck('categoria')
            ->sort()
            ->values();

        return Inertia::render('admin/rubros/index', [
            'rubros' => $rubrosQuery->get(),
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'categoria' => $categoria,
                'activo' => $activo,
            ],
        ]);
    }

    /**
     * Store a newly created rubro in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:2', 'max:100'],
            'clave' => ['nullable', 'string', 'max:100', 'unique:rubros,clave'],
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del rubro es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'clave.unique' => 'Ya existe un rubro con esta clave identificadora.',
            'color_hex.required' => 'Debes asignar un color al rubro.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #7c3aed).',
        ]);

        $clave = !empty($validated['clave'])
            ? Str::slug($validated['clave'], '_')
            : Str::slug($validated['nombre'], '_');

        // Garantizar clave única
        $baseClave = $clave;
        $counter = 1;
        while (Rubro::where('clave', $clave)->exists()) {
            $clave = "{$baseClave}_{$counter}";
            $counter++;
        }

        Rubro::create([
            'nombre' => trim($validated['nombre']),
            'clave' => $clave,
            'color_hex' => $validated['color_hex'],
            'categoria' => !empty($validated['categoria']) ? trim($validated['categoria']) : null,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Rubro creado correctamente.',
        ]);

        return back();
    }

    /**
     * Update the specified rubro in storage.
     */
    public function update(Request $request, $rubro): RedirectResponse
    {
        $rubroModel = $rubro instanceof Rubro ? $rubro : Rubro::findOrFail($rubro);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:2', 'max:100'],
            'clave' => ['required', 'string', 'max:100', 'unique:rubros,clave,' . $rubroModel->id],
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del rubro es obligatorio.',
            'clave.required' => 'La clave identificadora es obligatoria.',
            'clave.unique' => 'Ya existe otro rubro con esta clave.',
            'color_hex.required' => 'El color del rubro es obligatorio.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #7c3aed).',
        ]);

        $clave = Str::slug($validated['clave'], '_');

        // Si la clave cambió, verificar que no colisione
        if ($clave !== $rubroModel->clave && Rubro::where('clave', $clave)->where('id', '!=', $rubroModel->id)->exists()) {
            return back()->withErrors(['clave' => 'La clave ingresada ya está en uso por otro rubro.']);
        }

        $rubroModel->update([
            'nombre' => trim($validated['nombre']),
            'clave' => $clave,
            'color_hex' => $validated['color_hex'],
            'categoria' => !empty($validated['categoria']) ? trim($validated['categoria']) : null,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Rubro actualizado correctamente.',
        ]);

        return back();
    }

    /**
     * Remove the specified rubro from storage.
     */
    public function destroy(Request $request, $rubro): RedirectResponse
    {
        $rubroModel = $rubro instanceof Rubro ? $rubro : Rubro::findOrFail($rubro);

        $diplomadosCount = $rubroModel->diplomados()->count();
        $cursosCount = $rubroModel->cursos()->count();
        $especialidadesCount = $rubroModel->especialidades()->count();

        if ($diplomadosCount > 0 || $cursosCount > 0 || $especialidadesCount > 0) {
            $detalles = [];
            if ($especialidadesCount > 0) {
                $detalles[] = "{$especialidadesCount} " . ($especialidadesCount === 1 ? 'especialidad' : 'especialidades');
            }
            if ($diplomadosCount > 0) {
                $detalles[] = "{$diplomadosCount} " . ($diplomadosCount === 1 ? 'diplomado' : 'diplomados');
            }
            if ($cursosCount > 0) {
                $detalles[] = "{$cursosCount} " . ($cursosCount === 1 ? 'curso' : 'cursos');
            }

            $detallesTexto = implode(', ', $detalles);
            $mensajeError = "No se puede eliminar el rubro \"{$rubroModel->nombre}\" porque tiene {$detallesTexto} asociados. Puedes desactivarlo.";

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);

            return back()->with('error', $mensajeError)->with('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);
        }

        $nombre = $rubroModel->nombre;
        $rubroModel->delete();

        $mensajeExito = "Rubro \"{$nombre}\" eliminado con éxito.";

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $mensajeExito,
        ]);

        return back()->with('success', $mensajeExito)->with('toast', [
            'type' => 'success',
            'message' => $mensajeExito,
        ]);
    }
}
