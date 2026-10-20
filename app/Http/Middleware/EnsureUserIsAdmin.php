<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * Permite el acceso únicamente a usuarios autenticados con rol de administrador (ADMIN).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->is_enabled) {
            auth()->logout();

            return redirect()->route('home')->with('error', 'Tu cuenta está deshabilitada. Contacta al administrador.');
        }

        if (! $user || ! $user->esAdministrador()) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                abort(403, 'Acceso denegado. Se requiere el rol ADMIN para acceder a esta sección.');
            }

            if ($user?->esCapacitado()) {
                return redirect()->route('capacitado.index');
            }

            return redirect()->route('home')->with('error', 'Acceso denegado: Esta sección es exclusiva para usuarios con rol ADMIN.');
        }

        return $next($request);
    }
}
