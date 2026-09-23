<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Estado;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EstadoController extends Controller
{
    /**
     * Display a listing of estados.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $activo = $request->query('activo');

        $estadosQuery = Estado::query()
            ->withCount(['diplomados', 'cursos', 'especialidades'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                        ->orWhere('descripcion', 'like', "%{$search}%");
                });
            })
            ->when($activo !== null && $activo !== '' && $activo !== 'all', function ($query) use ($activo) {
                $query->where('activo', filter_var($activo, FILTER_VALIDATE_BOOLEAN));
            })
            ->orderBy('orden', 'asc')
            ->orderBy('nombre', 'asc');

        return Inertia::render('admin/estados/index', [
            'estados' => $estadosQuery->get(),
            'filters' => [
                'search' => $search,
                'activo' => $activo,
            ],
        ]);
    }

    /**
     * Store a newly created estado in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:2', 'max:100'],
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del estado es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'color_hex.required' => 'Debes asignar un color al estado.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #64748b).',
        ]);

        Estado::create([
            'nombre' => trim($validated['nombre']),
            'color_hex' => $validated['color_hex'],
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Estado registrado con éxito.',
        ]);

        return back();
    }

    /**
     * Update the specified estado in storage.
     */
    public function update(Request $request, $estado): RedirectResponse
    {
        $estadoModel = $estado instanceof Estado ? $estado : Estado::findOrFail($estado);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'min:2', 'max:100'],
            'color_hex' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ], [
            'nombre.required' => 'El nombre del estado es obligatorio.',
            'color_hex.required' => 'El color del estado es obligatorio.',
            'color_hex.regex' => 'El color debe ser un formato hexadecimal válido (ej. #64748b).',
        ]);

        $estadoModel->update([
            'nombre' => trim($validated['nombre']),
            'color_hex' => $validated['color_hex'],
            'descripcion' => !empty($validated['descripcion']) ? trim($validated['descripcion']) : null,
            'activo' => $validated['activo'] ?? true,
            'orden' => $validated['orden'] ?? 0,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Estado actualizado con éxito.',
        ]);

        return back();
    }

    /**
     * Remove the specified estado from storage.
     */
    public function destroy(Request $request, $estado): RedirectResponse
    {
        $estadoModel = $estado instanceof Estado ? $estado : Estado::findOrFail($estado);

        $especialidadesCount = $estadoModel->especialidades()->count();
        $diplomadosCount = $estadoModel->diplomados()->count();
        $cursosCount = $estadoModel->cursos()->count();

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
            $mensajeError = "No se puede eliminar el estado porque tiene {$detallesTexto} {$asociadoTexto}. Puedes desactivarlo.";

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);

            return back()->with('error', $mensajeError)->with('toast', [
                'type' => 'error',
                'message' => $mensajeError,
            ]);
        }

        $estadoModel->delete();

        $mensajeExito = 'Estado eliminado con éxito.';

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
