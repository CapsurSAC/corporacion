<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use App\Models\TrainingArea;
use App\Models\TrainingFileNode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapacitadoController extends Controller
{
    /**
     * Redirect to the first active area configured by the administrator.
     */
    public function index(): RedirectResponse
    {
        $area = TrainingArea::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->first();

        if (! $area) {
            return redirect()->route('home')->with('error', 'No hay áreas de capacitación activas disponibles.');
        }

        return redirect()->route('capacitado.area', ['trainingArea' => $area->slug]);
    }

    /**
     * Módulo de Venta.
     */
    public function venta(Request $request): Response
    {
        return Inertia::render('capacitado/venta', [
            'modulo' => 'Venta',
        ]);
    }

    /**
     * Módulo de Postventa.
     */
    public function postventa(Request $request): Response
    {
        return Inertia::render('capacitado/postventa', [
            'modulo' => 'Postventa',
        ]);
    }

    /**
     * Módulo de Informática.
     */
    public function informatica(Request $request): Response
    {
        return Inertia::render('capacitado/informatica', [
            'modulo' => 'Informática',
        ]);
    }

    /**
     * Módulo de Marketing.
     */
    public function marketing(Request $request): Response
    {
        return Inertia::render('capacitado/marketing', [
            'modulo' => 'Marketing',
        ]);
    }

    /**
     * Módulo Académico.
     */
    public function academico(Request $request): Response
    {
        return Inertia::render('capacitado/academico', [
            'modulo' => 'Académico',
        ]);
    }

    public function area(TrainingArea $trainingArea): Response
    {
        abort_unless($trainingArea->is_active, 404);

        return Inertia::render('capacitado/area', [
            'area' => $trainingArea->only([
                'name', 'slug', 'description', 'color', 'bot_name', 'initial_message',
            ]),
            'fileNodes' => $this->fileTree($trainingArea),
        ]);
    }

    public function download(TrainingFileNode $trainingFileNode)
    {
        $this->authorizeFile($trainingFileNode);

        return \Illuminate\Support\Facades\Storage::download($trainingFileNode->storage_path, $trainingFileNode->name);
    }

    public function view(TrainingFileNode $trainingFileNode)
    {
        $this->authorizeFile($trainingFileNode);

        return response()->file(\Illuminate\Support\Facades\Storage::path($trainingFileNode->storage_path));
    }

    private function fileTree(TrainingArea $area, ?int $parentId = null): array
    {
        $nodes = $area->hasMany(TrainingFileNode::class)->get();
        return $this->serializeFileTree($nodes, $parentId);
    }

    private function serializeFileTree($nodes, ?int $parentId): array
    {
        return $nodes->where('parent_id', $parentId)->sortBy(fn (TrainingFileNode $node) => [$node->type === 'file', strtolower($node->name)])
            ->map(fn (TrainingFileNode $node) => [
                'id' => $node->id, 'name' => $node->name, 'type' => $node->type,
                'mime_type' => $node->mime_type, 'file_size' => $node->file_size,
                'download_url' => $node->type === 'file' ? route('capacitado.archivos.download', $node) : null,
                'view_url' => $node->type === 'file' ? route('capacitado.archivos.view', $node) : null,
                'children' => $this->serializeFileTree($nodes, $node->id),
            ])->values()->all();
    }

    private function authorizeFile(TrainingFileNode $node): void
    {
        abort_unless(
            $node->type === 'file'
            && $node->storage_path
            && $node->area?->is_active,
            404
        );
    }
}
