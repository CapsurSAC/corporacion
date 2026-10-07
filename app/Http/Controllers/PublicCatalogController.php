<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use App\Models\Comercio;
use App\Models\Curso;
use App\Models\Diplomado;
use App\Models\Especialidad;
use App\Models\Grupo;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCatalogController extends Controller
{
    /**
     * Display the public corporate catalog for workers and visitors.
     */
    public function index(Request $request): Response
    {
        $grupos = Grupo::query()
            ->where('activo', true)
            ->with([
                'comercios' => function ($query) {
                    $query->where('activo', true)
                        ->with([
                            'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                            'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'especialidades' => fn ($q) => $q->latest('id'),
                        ])
                        ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
                        ->orderBy('nombre', 'asc');
                },
            ])
            ->orderBy('id', 'asc')
            ->get();

        $stats = [
            'totalGrupos' => Grupo::where('activo', true)->count(),
            'totalComercios' => Comercio::where('activo', true)->count(),
            'totalCarreras' => Carrera::count(),
            'totalDiplomados' => Diplomado::count(),
            'totalCursos' => Curso::count(),
            'totalEspecialidades' => Especialidad::count(),
        ];

        $driveLinks = [
            'escifor' => Setting::get('drive_escifor', '') ?? '',
            'multimarca' => Setting::get('drive_multimarca', '') ?? '',
        ];

        return Inertia::render('welcome', [
            'grupos' => $grupos,
            'stats' => $stats,
            'driveLinks' => $driveLinks,
            'contactInfo' => $this->getContactInfo(),
        ]);
    }

    /**
     * Display a specific commerce in the public corporate catalog.
     */
    public function show(string $slug): Response
    {
        $comercio = Comercio::query()
            ->where('slug', $slug)
            ->with([
                'grupo',
                'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                'especialidades' => fn ($q) => $q->latest('id'),
            ])
            ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
            ->firstOrFail();

        $grupos = Grupo::query()
            ->where('activo', true)
            ->with([
                'comercios' => function ($query) {
                    $query->where('activo', true)
                        ->with([
                            'carreras' => fn ($q) => $q->orderBy('nombre', 'asc'),
                            'diplomados' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'cursos' => fn ($q) => $q->orderBy('tipo', 'asc')->latest('id'),
                            'especialidades' => fn ($q) => $q->latest('id'),
                        ])
                        ->withCount(['carreras', 'diplomados', 'cursos', 'especialidades'])
                        ->orderBy('nombre', 'asc');
                },
            ])
            ->orderBy('id', 'asc')
            ->get();

        $stats = [
            'totalGrupos' => Grupo::where('activo', true)->count(),
            'totalComercios' => Comercio::where('activo', true)->count(),
            'totalCarreras' => Carrera::count(),
            'totalDiplomados' => Diplomado::count(),
            'totalCursos' => Curso::count(),
            'totalEspecialidades' => Especialidad::count(),
        ];

        $driveLinks = [
            'escifor' => Setting::get('drive_escifor', '') ?? '',
            'multimarca' => Setting::get('drive_multimarca', '') ?? '',
        ];

        return Inertia::render('welcome', [
            'grupos' => $grupos,
            'initialComercio' => $comercio,
            'stats' => $stats,
            'driveLinks' => $driveLinks,
            'contactInfo' => $this->getContactInfo(),
        ]);
    }

    /**
     * Retrieve institutional contact information settings.
     */
    private function getContactInfo(): array
    {
        return [
            'address' => Setting::get('contact_address') ?: 'Av. Coronel Justo Arias Aragüez N° 1111',
            'addressDetail' => Setting::get('contact_address_detail') ?: 'Tacna, Perú — Edificio Corporativo Grupo CAPSUR',
            'phone' => Setting::get('contact_phone') ?: '+51 963 147 270',
            'phoneDetail' => Setting::get('contact_phone_detail') ?: 'Matrículas, carreras y certificaciones técnicas',
            'whatsapp' => Setting::get('contact_whatsapp') ?: '+51 963 147 270',
            'whatsappMessage' => Setting::get('contact_whatsapp_message') ?: 'Hola, deseo más información sobre los programas de Grupo CAPSUR',
            'email' => Setting::get('contact_email') ?: 'contacto@grupocapsur.edu.pe',
            'emailDetail' => Setting::get('contact_email_detail') ?: 'Consultas corporativas',
            'schedule' => Setting::get('contact_schedule') ?: 'Lun - Sáb · 8:00 AM – 7:00 PM',
            'scheduleDetail' => Setting::get('contact_schedule_detail') ?: 'Atención continua',
            'mapsUrl' => Setting::get('contact_maps_url') ?: 'https://www.google.com/maps/search/?api=1&query=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA',
            'mapsEmbedUrl' => Setting::get('contact_maps_embed_url') ?: 'https://maps.google.com/maps?q=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA&t=&z=16&ie=UTF8&iwloc=&output=embed',
            'bannerTitle' => Setting::get('contact_banner_title') ?: 'Educación que genera oportunidades',
            'bannerSubtitle' => Setting::get('contact_banner_subtitle') ?: 'Sede Central Institucional · Tacna, Perú',
        ];
    }
}
