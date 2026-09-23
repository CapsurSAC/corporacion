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

class LogoController extends Controller
{
    /**
     * Display a listing of comercios with their light/dark logos.
     */
    public function index(Request $request): Response
    {
        $grupoId = $request->query('grupo_id');
        $search = $request->query('search');

        $comercios = Comercio::query()
            ->with('grupo:id,nombre,slug')
            ->when($grupoId, fn ($q) => $q->where('grupo_id', $grupoId))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%")
                        ->orWhere('sigla', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->orderBy('grupo_id')
            ->orderBy('nombre')
            ->get();

        $grupos = Grupo::query()
            ->select('id', 'nombre', 'slug', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/logos/index', [
            'comercios' => $comercios,
            'grupos' => $grupos,
            'filters' => [
                'grupo_id' => $grupoId,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update the light and dark logos for a specific comercio.
     */
    public function update(Request $request, Comercio $comercio): RedirectResponse
    {
        $request->validate([
            'logo_modo_claro' => ['nullable', 'string', 'max:500'],
            'logo_modo_oscuro' => ['nullable', 'string', 'max:500'],
            'logo_modo_claro_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:3072'],
            'logo_modo_oscuro_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:3072'],
        ], [
            'logo_modo_claro_file.image' => 'El logo para modo claro debe ser una imagen válida (PNG, JPG, SVG, WebP).',
            'logo_modo_claro_file.max' => 'El logo para modo claro no debe superar 3MB.',
            'logo_modo_oscuro_file.image' => 'El logo para modo oscuro debe ser una imagen válida (PNG, JPG, SVG, WebP).',
            'logo_modo_oscuro_file.max' => 'El logo para modo oscuro no debe superar 3MB.',
        ]);

        $destinationPath = public_path('logos-comercios');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // Subida o actualización de Logo Modo Claro
        if ($request->hasFile('logo_modo_claro_file')) {
            $file = $request->file('logo_modo_claro_file');
            $filename = Str::slug($comercio->slug) . '-claro-' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationPath, $filename);
            $comercio->logo_modo_claro = '/logos-comercios/' . $filename;
        } elseif ($request->has('logo_modo_claro')) {
            $comercio->logo_modo_claro = $request->input('logo_modo_claro');
        }

        // Subida o actualización de Logo Modo Oscuro
        if ($request->hasFile('logo_modo_oscuro_file')) {
            $file = $request->file('logo_modo_oscuro_file');
            $filename = Str::slug($comercio->slug) . '-oscuro-' . time() . '.' . $file->getClientOriginalExtension();
            $file->move($destinationPath, $filename);
            $comercio->logo_modo_oscuro = '/logos-comercios/' . $filename;
        } elseif ($request->has('logo_modo_oscuro')) {
            $comercio->logo_modo_oscuro = $request->input('logo_modo_oscuro');
        }

        $comercio->save();

        return back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'title' => '¡Logos Actualizados!',
                'message' => 'Logotipos institucionales actualizados con éxito.',
            ],
        ]);
    }
}
