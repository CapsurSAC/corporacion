<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactoController extends Controller
{
    /**
     * Show the form for editing institutional contact information.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('admin/contacto/index', [
            'contact' => [
                'address' => Setting::get('contact_address') ?? 'Av. Coronel Justo Arias Aragüez N° 1111',
                'address_detail' => Setting::get('contact_address_detail') ?? 'Tacna, Perú — Edificio Corporativo Grupo CAPSUR',
                'phone' => Setting::get('contact_phone') ?? '+51 963 147 270',
                'phone_detail' => Setting::get('contact_phone_detail') ?? 'Matrículas, carreras y certificaciones técnicas',
                'whatsapp' => Setting::get('contact_whatsapp') ?? '+51 963 147 270',
                'whatsapp_message' => Setting::get('contact_whatsapp_message') ?? 'Hola, deseo más información sobre los programas de Grupo CAPSUR',
                'email' => Setting::get('contact_email') ?? 'contacto@grupocapsur.edu.pe',
                'email_detail' => Setting::get('contact_email_detail') ?? 'Consultas corporativas',
                'schedule' => Setting::get('contact_schedule') ?? 'Lun - Sáb · 8:00 AM – 7:00 PM',
                'schedule_detail' => Setting::get('contact_schedule_detail') ?? 'Atención continua',
                'maps_url' => Setting::get('contact_maps_url') ?? 'https://www.google.com/maps/search/?api=1&query=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA',
                'maps_embed_url' => Setting::get('contact_maps_embed_url') ?? 'https://maps.google.com/maps?q=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA&t=&z=16&ie=UTF8&iwloc=&output=embed',
                'banner_title' => Setting::get('contact_banner_title') ?? 'Educación que genera oportunidades',
                'banner_subtitle' => Setting::get('contact_banner_subtitle') ?? 'Sede Central Institucional · Tacna, Perú',
            ],
        ]);
    }

    /**
     * Update institutional contact information.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'address' => ['nullable', 'string', 'max:255'],
            'address_detail' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:100'],
            'phone_detail' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:100'],
            'whatsapp_message' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'string', 'max:255'],
            'email_detail' => ['nullable', 'string', 'max:255'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'schedule_detail' => ['nullable', 'string', 'max:255'],
            'maps_url' => ['nullable', 'string', 'max:1000'],
            'maps_embed_url' => ['nullable', 'string', 'max:2000'],
            'banner_title' => ['nullable', 'string', 'max:255'],
            'banner_subtitle' => ['nullable', 'string', 'max:255'],
        ]);

        $mapsEmbedUrl = trim($validated['maps_embed_url'] ?? '');
        if ($mapsEmbedUrl && preg_match('/src=["\']([^"\']+)["\']/', $mapsEmbedUrl, $matches)) {
            $mapsEmbedUrl = $matches[1];
        }

        $mapsUrl = trim($validated['maps_url'] ?? '');
        if ($mapsUrl && !preg_match('#^https?://#i', $mapsUrl)) {
            $mapsUrl = 'https://' . $mapsUrl;
        }

        Setting::set('contact_address', trim($validated['address'] ?? '') ?: null);
        Setting::set('contact_address_detail', trim($validated['address_detail'] ?? '') ?: null);
        Setting::set('contact_phone', trim($validated['phone'] ?? '') ?: null);
        Setting::set('contact_phone_detail', trim($validated['phone_detail'] ?? '') ?: null);
        Setting::set('contact_whatsapp', trim($validated['whatsapp'] ?? '') ?: null);
        Setting::set('contact_whatsapp_message', trim($validated['whatsapp_message'] ?? '') ?: null);
        Setting::set('contact_email', trim($validated['email'] ?? '') ?: null);
        Setting::set('contact_email_detail', trim($validated['email_detail'] ?? '') ?: null);
        Setting::set('contact_schedule', trim($validated['schedule'] ?? '') ?: null);
        Setting::set('contact_schedule_detail', trim($validated['schedule_detail'] ?? '') ?: null);
        Setting::set('contact_maps_url', $mapsUrl ?: null);
        Setting::set('contact_maps_embed_url', $mapsEmbedUrl ?: null);
        Setting::set('contact_banner_title', trim($validated['banner_title'] ?? '') ?: null);
        Setting::set('contact_banner_subtitle', trim($validated['banner_subtitle'] ?? '') ?: null);

        return back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'title' => '¡Contacto Guardado!',
                'message' => 'La información de contacto institucional se ha actualizado exitosamente y ya se refleja en la web pública.',
            ],
        ]);
    }
}
