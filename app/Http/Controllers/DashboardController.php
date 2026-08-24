<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Grupo;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $email = strtolower($request->user()->email);

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        $grupos = Grupo::query()
            ->with([
                'comercios' => function ($query) {
                    $query->withCount('carreras')->orderBy('nombre');
                },
            ])
            ->withCount(['comercios', 'carreras'])
            ->orderBy('id')
            ->get();

        $stats = [
            'totalGrupos' => Grupo::count(),
            'totalComercios' => Comercio::count(),
            'totalCarreras' => Carrera::count(),
            'carrerasActivas' => Carrera::where('estado', 'activo')->count(),
            'carrerasEnConvocatoria' => Carrera::where('estado', 'en_convocatoria')->count(),
        ];

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'grupos' => $grupos,
            'stats' => $stats,
        ]);
    }
}
