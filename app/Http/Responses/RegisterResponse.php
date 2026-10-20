<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();
        if ($user?->esAdministrador()) {
            $redirectUrl = Fortify::redirects('register');
        } elseif ($user?->esCapacitado()) {
            $redirectUrl = route('capacitado.index');
        } else {
            $redirectUrl = '/';
        }

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 201)
            : redirect()->intended($redirectUrl);
    }
}
