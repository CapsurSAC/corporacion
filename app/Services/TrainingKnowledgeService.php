<?php

namespace App\Services;

use App\Models\TrainingArea;
use App\Models\TrainingDocument;
use App\Models\TrainingDocumentChunk;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TrainingKnowledgeService
{
    public function __construct(private TrainingDocumentTextExtractor $extractor) {}

    public function indexDocument(TrainingDocument $document): void
    {
        $document->update(['extraction_error' => null]);

        try {
            $text = $this->extractor->extract(
                Storage::path($document->storage_path),
                $document->mime_type
            );
            $chunks = $this->chunk($text);

            DB::transaction(function () use ($document, $chunks): void {
                $document->chunks()->delete();
                foreach ($chunks as $index => $content) {
                    TrainingDocumentChunk::create([
                        'training_document_id' => $document->id,
                        'training_area_id' => $document->training_area_id,
                        'chunk_index' => $index,
                        'content' => $content,
                    ]);
                }
                $document->update([
                    'status' => 'draft',
                    'published_at' => null,
                    'extraction_error' => null,
                ]);
            });
        } catch (\Throwable $exception) {
            $document->update([
                'status' => 'draft',
                'extraction_error' => $exception->getMessage(),
            ]);
            throw $exception;
        }
    }

    /**
     * Retrieves only active, published chunks from the requested area.
     *
     * @return array<int, string>
     */
    public function retrieve(TrainingArea $area, string $query, int $limit = 6): array
    {
        $terms = $this->terms($query);
        if ($terms === []) {
            return [];
        }

        $chunks = TrainingDocumentChunk::query()
            ->where('training_area_id', $area->id)
            ->whereHas('document', fn ($q) => $q->where('status', 'published'))
            ->get(['content']);

        $ranked = $chunks->map(function (TrainingDocumentChunk $chunk) use ($terms): array {
            $lower = mb_strtolower($chunk->content);
            $score = 0;
            foreach ($terms as $term) {
                $score += substr_count($lower, $term);
            }
            return ['score' => $score, 'content' => $chunk->content];
        })->filter(fn (array $item) => $item['score'] > 0)
            ->sortByDesc('score')
            ->take($limit)
            ->pluck('content')
            ->values()
            ->all();

        if ($ranked !== [] || ! $this->isSummaryQuery($query)) {
            return $ranked;
        }

        return $chunks->take($limit)->pluck('content')->values()->all();
    }

    /** @return array<int, string> */
    protected function chunk(string $text): array
    {
        $paragraphs = preg_split('/\R{2,}/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [$text];
        $chunks = [];
        $current = '';
        foreach ($paragraphs as $paragraph) {
            $paragraph = trim($paragraph);
            if ($current !== '' && mb_strlen($current) + mb_strlen($paragraph) + 2 > 1800) {
                $chunks[] = $current;
                $current = '';
            }
            $current .= ($current === '' ? '' : "\n\n") . $paragraph;
        }
        if ($current !== '') {
            $chunks[] = $current;
        }
        return $chunks;
    }

    /** @return array<int, string> */
    protected function terms(string $text): array
    {
        $normalized = mb_strtolower($text);
        $normalized = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $normalized) ?? '';
        return array_values(array_unique(array_filter(
            preg_split('/\s+/', $normalized) ?: [],
            fn (string $term) => mb_strlen($term) >= 4
        )));
    }

    protected function isSummaryQuery(string $query): bool
    {
        return preg_match(
            '/\b(resumen|resumir|describe|describir|informacion general|de que trata|funciones del area|que hace el area)\b/ui',
            $query
        ) === 1;
    }
}
