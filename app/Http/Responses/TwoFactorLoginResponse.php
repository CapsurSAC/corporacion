<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
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
