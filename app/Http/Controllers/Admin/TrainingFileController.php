<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingArea;
use App\Models\TrainingFileNode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TrainingFileController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/archivos/index', [
            'areas' => TrainingArea::where('is_active', true)
                ->withCount(['fileNodes as files_count'])
                ->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'slug', 'color']),
        ]);
    }

    public function show(TrainingArea $trainingArea): Response
    {
        return Inertia::render('admin/archivos/show', [
            'area' => $trainingArea->only(['id', 'name', 'slug', 'color']),
            'nodes' => $this->nodes($trainingArea),
        ]);
    }

    public function storeFolder(Request $request, TrainingArea $trainingArea): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:training_file_nodes,id'],
        ]);
        $parent = $this->parentForArea($data['parent_id'] ?? null, $trainingArea);
        $this->createNode($trainingArea, $parent, trim($data['name']), 'folder', $request);
        return back();
    }

    public function storeFile(Request $request, TrainingArea $trainingArea): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:51200'],
            'parent_id' => ['nullable', 'integer', 'exists:training_file_nodes,id'],
        ]);
        $parent = $this->parentForArea($data['parent_id'] ?? null, $trainingArea);
        $file = $request->file('file');
        $node = $this->createNode(
            $trainingArea,
            $parent,
            trim(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)),
            'file',
            $request,
        );
        $node->update([
            'storage_path' => $file->store('training-files/' . $trainingArea->slug),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);
        return back();
    }

    public function destroy(TrainingFileNode $trainingFileNode): RedirectResponse
    {
        abort_unless($trainingFileNode->area, 404);
        if ($trainingFileNode->type === 'file' && $trainingFileNode->storage_path) {
            Storage::delete($trainingFileNode->storage_path);
        }
        $trainingFileNode->delete();
        return back();
    }

    public function download(TrainingFileNode $trainingFileNode)
    {
        abort_unless($trainingFileNode->type === 'file' && $trainingFileNode->storage_path, 404);
        return Storage::download($trainingFileNode->storage_path, $trainingFileNode->name);
    }

    private function nodes(TrainingArea $area): array
    {
        $nodes = $area->hasMany(TrainingFileNode::class)->get();
        return $this->tree($nodes, null);
    }

    private function tree($nodes, ?int $parentId): array
    {
        return $nodes->where('parent_id', $parentId)->sortBy(fn (TrainingFileNode $node) => [$node->type === 'file', strtolower($node->name)])
            ->map(fn (TrainingFileNode $node) => [
                'id' => $node->id, 'name' => $node->name, 'type' => $node->type,
                'mime_type' => $node->mime_type, 'file_size' => $node->file_size,
                'download_url' => $node->type === 'file' ? route('admin.archivos.download', $node) : null,
                'children' => $this->tree($nodes, $node->id),
            ])->values()->all();
    }

    private function parentForArea(?int $parentId, TrainingArea $area): ?TrainingFileNode
    {
        if (! $parentId) {
            return null;
        }
        return TrainingFileNode::where('training_area_id', $area->id)
            ->where('type', 'folder')->findOrFail($parentId);
    }

    private function createNode(TrainingArea $area, ?TrainingFileNode $parent, string $name, string $type, Request $request): TrainingFileNode
    {
        abort_if($name === '', 422, 'El nombre no puede estar vacío.');
        return TrainingFileNode::create([
            'training_area_id' => $area->id,
            'parent_id' => $parent?->id,
            'type' => $type,
            'name' => $name,
            'created_by' => $request->user()->id,
        ]);
    }
}
