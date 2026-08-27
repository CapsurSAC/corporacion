<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriveCapacitacionController extends Controller
{
    /**
     * Show the form for editing Drive Capacitaciones links.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('admin/drive-capacitaciones/index', [
            'driveEscifor' => Setting::get('drive_escifor', '') ?? '',
            'driveMultimarca' => Setting::get('drive_multimarca', '') ?? '',
        ]);
    }

    /**
     * Update Drive Capacitaciones links.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'drive_escifor' => ['nullable', 'string', 'max:500'],
            'drive_multimarca' => ['nullable', 'string', 'max:500'],
        ]);

        // Asegurar que si tiene texto empiece con http si no lo tiene, o permitir formato url flexible
        $esciforUrl = trim($validated['drive_escifor'] ?? '');
        $multimarcaUrl = trim($validated['drive_multimarca'] ?? '');

        if ($esciforUrl && !preg_match('#^https?://#i', $esciforUrl)) {
            $esciforUrl = 'https://' . $esciforUrl;
        }

        if ($multimarcaUrl && !preg_match('#^https?://#i', $multimarcaUrl)) {
            $multimarcaUrl = 'https://' . $multimarcaUrl;
        }

        Setting::set('drive_escifor', $esciforUrl ?: null);
        Setting::set('drive_multimarca', $multimarcaUrl ?: null);

        return back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'title' => '¡Enlaces Guardados!',
                'message' => 'Los enlaces de redirección para Drive Capacitaciones se han actualizado exitosamente.',
            ],
        ]);
    }
}
