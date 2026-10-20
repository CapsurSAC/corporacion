<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();
        if ($user?->esAdministrador()) {
            $redirectUrl = Fortify::redirects('login');
        } elseif ($user?->esCapacitado()) {
            $redirectUrl = route('capacitado.index');
        } else {
            $redirectUrl = '/';
        }

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended($redirectUrl);
    }
}
