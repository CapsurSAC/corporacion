<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsCapacitado
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && ! $request->user()->is_enabled) {
            auth()->logout();

            return redirect()->route('home')->with('error', 'Tu cuenta está deshabilitada. Contacta al administrador.');
        }

        if (! $request->user()?->esCapacitado()) {
            abort(403, 'Acceso denegado. Se requiere el rol CAPACITADO.');
        }

        return $next($request);
    }
}
