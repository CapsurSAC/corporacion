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
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del rubro es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'color_hex.required' => 'Debes asignar un color al rubro.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #7c3aed).',
        ]);

        Rubro::create([
            'nombre' => trim($validated['nombre']),
            'color_hex' => $validated['color_hex'],
            'categoria' => !empty($validated['categoria']) ? trim($validated['categoria']) : null,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Rubro registrado con éxito.',
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
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del rubro es obligatorio.',
            'color_hex.required' => 'El color del rubro es obligatorio.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #7c3aed).',
        ]);

        $rubroModel->update([
            'nombre' => trim($validated['nombre']),
            'color_hex' => $validated['color_hex'],
            'categoria' => !empty($validated['categoria']) ? trim($validated['categoria']) : null,
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Rubro actualizado con éxito.',
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

            $totalCount = $especialidadesCount + $diplomadosCount + $cursosCount;
            $detallesTexto = implode(', ', $detalles);
            $asociadoTexto = $totalCount === 1 ? ($especialidadesCount === 1 ? 'asociada' : 'asociado') : 'asociados';
            $mensajeError = "No se puede eliminar el rubro porque tiene {$detallesTexto} {$asociadoTexto}. Puedes desactivarlo.";

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);

            return back()->with('error', $mensajeError)->with('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);
        }

        $rubroModel->delete();

        $mensajeExito = 'Rubro eliminado con éxito.';

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
