<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAuthenticatedFromPublic
{
    /**
     * Handle an incoming request.
     *
     * Impide que usuarios con rol ADMIN o CAPACITADO accedan a la vista pública cuando están autenticados.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            if ($user->esAdministrador()) {
                return redirect()->route('dashboard');
            }

            if ($user->esCapacitado()) {
                return redirect()->route('capacitado.index');
            }
        }

        return $next($request);
    }
}
