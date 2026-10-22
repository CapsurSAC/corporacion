<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanAccessTrainingArea
{
    public function handle(Request $request, Closure $next): Response
    {
        $assignedSlug = $request->user()?->trainingArea?->slug;
        $routeArea = $request->route('trainingArea');
        $routeFile = $request->route('trainingFileNode');
        $requestedSlug = is_object($routeArea) ? $routeArea->slug : ($routeArea ?: null);

        if ($routeFile) {
            $requestedSlug = $routeFile->area?->slug;
        }

        if ($request->is('capacitado/chat') && $request->input('area')) {
            $requestedSlug = $request->input('area');
        }

        if (in_array($request->segment(2), ['venta', 'postventa', 'informatica', 'marketing', 'academico'], true)) {
            $requestedSlug = $request->segment(2);
        }

        if ($requestedSlug && $requestedSlug !== $assignedSlug) {
            $message = 'No tienes autorización para acceder a esta área de capacitación.';

            if ($request->expectsJson()) {
                return response()->json(['message' => $message], 403);
            }

            if ($request->header('X-Inertia')) {
                return Inertia::render('errors/403', ['message' => $message])
                    ->toResponse($request)
                    ->setStatusCode(403);
            }

            return response()->view('errors.403', ['message' => $message], 403);
        }

        return $next($request);
    }
}