<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingArea;
use App\Models\TrainingDocument;
use App\Models\TrainingFileNode;
use App\Models\User;
use App\Services\TrainingKnowledgeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TrainingAreaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/capacitacion/index', [
            'areas' => TrainingArea::withCount([
                'documents as published_documents_count' => fn ($q) => $q->where('status', 'published'),
            ])->with('documents:id,training_area_id,title,original_filename,status,version,file_size,extraction_error,created_at')
                ->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedArea($request);
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name']);
        $data['created_by'] = $request->user()->id;
        TrainingArea::create($data);
        return back();
    }

    public function update(Request $request, TrainingArea $trainingArea): RedirectResponse
    {
        $data = $this->validatedArea($request, $trainingArea->id);
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? $data['name'], $trainingArea->id);
        $trainingArea->update($data);
        return back();
    }

    public function destroy(TrainingArea $trainingArea): RedirectResponse
    {
        $assignedUsers = User::where('training_area_id', $trainingArea->id)->count();
        if ($assignedUsers > 0) {
            return back()->withErrors([
                'area' => "No se puede eliminar el área porque tiene {$assignedUsers} usuario(s) asignado(s). Reasígnalos a otra área o desactívala.",
            ]);
        }

        foreach ($trainingArea->documents as $document) {
            Storage::delete($document->storage_path);
        }
        $storedFiles = TrainingFileNode::where('training_area_id', $trainingArea->id)
            ->whereNotNull('storage_path')->pluck('storage_path');
        foreach ($storedFiles as $path) {
            Storage::delete($path);
        }
        $trainingArea->delete();
        return back();
    }

    public function storeDocument(
        Request $request,
        TrainingArea $trainingArea,
        TrainingKnowledgeService $knowledge
    ): RedirectResponse {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'document' => ['required', 'file', 'mimes:pdf,docx', 'max:20480'],
        ]);

        $file = $request->file('document');
        $hash = hash_file('sha256', $file->getRealPath());
        if ($trainingArea->documents()->where('content_hash', $hash)->exists()) {
            return back()->withErrors(['document' => 'Este documento ya existe en el área.']);
        }

        $path = $file->store('knowledge');
        $document = $trainingArea->documents()->create([
            'title' => trim($data['title']),
            'original_filename' => $file->getClientOriginalName(),
            'storage_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'content_hash' => $hash,
            'version' => ((int) $trainingArea->documents()->max('version')) + 1,
            'uploaded_by' => $request->user()->id,
        ]);

        try {
            $knowledge->indexDocument($document);
        } catch (\Throwable $exception) {
            return back()->withErrors(['document' => 'No se pudo procesar el documento: ' . $exception->getMessage()]);
        }

        return back();
    }

    public function destroyDocument(TrainingDocument $trainingDocument): RedirectResponse
    {
        Storage::delete($trainingDocument->storage_path);
        $trainingDocument->delete();
        return back();
    }

    public function updateDocumentStatus(Request $request, TrainingDocument $trainingDocument): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:draft,published,archived']]);
        $trainingDocument->update([
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? now() : null,
        ]);
        return back();
    }

    private function validatedArea(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'slug' => ['nullable', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                'unique:training_areas,slug' . ($ignoreId ? ',' . $ignoreId : '')],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'bot_name' => ['nullable', 'string', 'max:160'],
            'initial_message' => ['nullable', 'string', 'max:3000'],
            'ai_instructions' => ['nullable', 'string', 'max:5000'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $slug = Str::slug($value);
        $query = TrainingArea::where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }
        return $query->exists() ? $slug . '-' . Str::lower(Str::random(5)) : $slug;
    }
}
