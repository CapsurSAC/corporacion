<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CapacitadoChatService
{
    /**
     * Mapeo de nombres legibles para cada área.
     */
    protected array $areaTitles = [
        'venta' => 'Ventas y Gestión Comercial',
        'postventa' => 'Postventa y Atención al Alumno',
        'informatica' => 'Informática & TI',
        'marketing' => 'Marketing & Medios',
        'academico' => 'Académica & Planes Curriculares',
    ];

    /**
     * Obtiene el documento oficial de conocimiento para el área solicitada.
     */
    public function getAreaKnowledge(string $area): string
    {
        // 1. Verificar si existe en storage (personalizado / subido por el admin)
        $storagePath = storage_path("app/knowledge/{$area}.md");
        if (File::exists($storagePath)) {
            return File::get($storagePath);
        }

        // 2. Verificar en resources/knowledge/ (archivos base del repositorio)
        $resourcePath = resource_path("knowledge/{$area}.md");
        if (File::exists($resourcePath)) {
            return File::get($resourcePath);
        }

        return "No se encontró el manual administrativo para el área de {$area}.";
    }

    /**
     * Procesa la consulta del capacitado con el modelo de IA o motor de conocimiento.
     */
    public function ask(string $area, string $userMessage, array $history = []): string
    {
        $databaseArea = \App\Models\TrainingArea::where('slug', $area)->where('is_active', true)->first();
        $areaTitle = $databaseArea?->name ?? $this->areaTitles[$area] ?? ucfirst($area);
        $knowledge = $this->getAreaKnowledge($area);
        $ragContext = $databaseArea
            ? app(TrainingKnowledgeService::class)->retrieve($databaseArea, $userMessage)
            : [];
        if ($databaseArea) {
            $hasPublishedDocuments = $databaseArea->documents()
                ->where('status', 'published')
                ->exists();
            if ($ragContext !== []) {
                $knowledge = implode("\n\n--- FRAGMENTO RELEVANTE ---\n\n", $ragContext);
            } elseif ($hasPublishedDocuments) {
                $knowledge = 'No se encontró un fragmento relevante en los documentos oficiales publicados para esta consulta.';
            }
        }
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-3.5-flash-lite');

        // Si hay API Key de Gemini configurada, consultar a la API de Google Gemini
        if (! empty($apiKey)) {
            try {
                return $this->callGeminiApi($apiKey, $model, $areaTitle, $knowledge, $userMessage, $history, $databaseArea?->ai_instructions);
            } catch (\Throwable $e) {
                Log::error("Error consultando Gemini API para área {$area}: " . $e->getMessage());
                // Caída suave al motor de conocimiento local en caso de error de red o cuota
            }
        }

        // Motor de respuesta estructurado en base al manual oficial del área
        return $this->fallbackKnowledgeSearch($area, $areaTitle, $knowledge, $userMessage);
    }

    /**
     * Realiza la llamada HTTP a Google Gemini.
     */
    protected function callGeminiApi(
        string $apiKey,
        string $model,
        string $areaTitle,
        string $knowledge,
        string $userMessage,
        array $history,
        ?string $areaInstructions = null
    ): string {
        $systemInstruction = <<<PROMPT
Eres el Asistente Virtual Oficial de Inducción y Capacitación de Grupo CAPSUR para el área de {$areaTitle}.
Tu misión es instruir y capacitar a los colaboradores en periodo de formación sobre los procedimientos, herramientas, reglamentos y políticas de su área.

DIRECTRICES DE RESPUESTA:
1. Para consultas sobre procedimientos, funciones, herramientas, normativas o políticas de la empresa, basa tus respuestas de forma ESTRICTA Y PRIORITARIA en el "MANUAL OFICIAL DEL ÁREA" provisto abajo.
2. Si la consulta del capacitado es un saludo cordial o una pregunta general, cotidiana o matemática (por ejemplo "¿cuánto es 2+2?", "¿qué es el software?", "¿cómo estás?"), responde con cordialidad, brevedad y precisión, y luego recuérdale amablemente que estás a su disposición para cualquier consulta sobre el área de {$areaTitle}.
3. Si la consulta es sobre un tema corporativo o procedimiento de la empresa que NO está contemplado en el manual, indícale amablemente que debe elevar su consulta a su supervisor inmediato o jefatura del área, sin inventar procedimientos falsos.
4. Responde siempre con tono pedagógico, cordial, profesional y motivador.
5. Utiliza formato Markdown limpio (negritas, listas con viñetas) para facilitar la lectura.
6. Contexto general de la empresa: Grupo CAPSUR es una corporación educativa con sede central en Tacna, Perú, conformada por los institutos ESCIFOR, MULTIMARCA y GLOBALEX.
7. Instrucciones adicionales aprobadas para esta área: {$areaInstructions}

MANUAL OFICIAL DEL ÁREA ({$areaTitle}):
{$knowledge}
PROMPT;

        $contents = [];

        // Agregar historial reciente (máximo 6 mensajes para conservar contexto eficiente)
        $recentHistory = array_slice($history, -6);
        foreach ($recentHistory as $item) {
            if (isset($item['sender']) && isset($item['text'])) {
                $role = ($item['sender'] === 'user') ? 'user' : 'model';
                $contents[] = [
                    'role' => $role,
                    'parts' => [
                        ['text' => $item['text']],
                    ],
                ];
            }
        }

        // Agregar el mensaje actual del usuario
        $contents[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $userMessage],
            ],
        ];

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        $response = Http::withoutVerifying()->timeout(30)->post($endpoint, [
            'system_instruction' => [
                'parts' => [
                    ['text' => $systemInstruction],
                ],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.25,
                'maxOutputTokens' => 1200,
            ],
        ]);

        if ($response->successful()) {
            $reply = $response->json('candidates.0.content.parts.0.text');
            if (! empty($reply)) {
                return trim($reply);
            }
        }

        throw new \RuntimeException('Gemini API response format error: ' . $response->body());
    }

    /**
     * Motor de búsqueda y extracción de conocimiento local a partir del manual oficial.
     */
    protected function fallbackKnowledgeSearch(
        string $area,
        string $areaTitle,
        string $knowledge,
        string $userMessage
    ): string {
        $clean = strtolower($userMessage);

        // Saludos
        if (preg_match('/(hola|buenos d[ií]as|buenas tardes|buenas noches|saludos)/i', $clean)) {
            return "¡Hola! Con gusto te asisto. Estoy cargado con el **Manual Administrativo Oficial de {$areaTitle}** de Grupo CAPSUR. Puedes preguntarme sobre cualquier directriz, procedimiento o consultar los temas sugeridos.";
        }

        // Agradecimientos
        if (preg_match('/(gracias|muchas gracias|agradezco|excelente)/i', $clean)) {
            return "¡Un placer ayudarte en tu proceso de capacitación! Si tienes más dudas sobre el área de **{$areaTitle}**, aquí estaré para resolverlas.";
        }

        // Dividir el documento en secciones por encabezados (##)
        $sections = preg_split('/(?=##\s+)/', $knowledge);
        $bestMatch = null;
        $highestScore = 0;

        $words = array_filter(explode(' ', preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $clean)), fn ($w) => mb_strlen($w) > 3);

        foreach ($sections as $section) {
            $sectionLower = strtolower($section);
            $score = 0;

            foreach ($words as $word) {
                if (str_contains($sectionLower, $word)) {
                    $score += 1;
                }
            }

            if ($score > $highestScore) {
                $highestScore = $score;
                $bestMatch = $section;
            }
        }

        if ($bestMatch && $highestScore > 0) {
            return trim($bestMatch);
        }

        // Si no se encuentra coincidencia exacta
        return "Según el **Manual Oficial de {$areaTitle}** de Grupo CAPSUR, esta consulta no se encuentra explícitamente detallada en el documento base.\n\n" .
            "Te recomendamos:\n" .
            "- Consultar directamente con la jefatura o supervisor de **{$areaTitle}**.\n" .
            "- Revisar los temas sugeridos arriba para conocer los procedimientos estándar normados.";
    }
}
