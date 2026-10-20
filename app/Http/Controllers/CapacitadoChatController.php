<?php

namespace App\Http\Controllers;

use App\Services\CapacitadoChatService;
use App\Models\TrainingArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CapacitadoChatController extends Controller
{
    /**
     * Procesa la consulta de un capacitado mediante IA o motor de conocimiento.
     */
    public function chat(Request $request, CapacitadoChatService $chatService): JsonResponse
    {
        @set_time_limit(60);

        $validated = $request->validate([
            'area' => ['required', 'string', 'max:120', function (string $attribute, mixed $value, \Closure $fail): void {
                if (! in_array($value, ['venta', 'postventa', 'informatica', 'marketing', 'academico'], true)
                    && ! TrainingArea::where('slug', $value)->where('is_active', true)->exists()) {
                    $fail('El área de capacitación no está disponible.');
                }
            }],
            'message' => 'required|string|max:1500',
            'history' => 'nullable|array',
            'history.*.sender' => 'nullable|string|in:bot,user',
            'history.*.text' => 'nullable|string',
        ]);

        $reply = $chatService->ask(
            area: $validated['area'],
            userMessage: $validated['message'],
            history: $validated['history'] ?? []
        );

        return response()->json([
            'reply' => $reply,
            'timestamp' => now()->format('H:i'),
        ]);
    }
}
