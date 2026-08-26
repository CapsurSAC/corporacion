<?php

use App\Http\Controllers\Admin\CarreraController;
use App\Http\Controllers\Admin\ComercioController;
use App\Http\Controllers\Admin\GrupoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicCatalogController::class, 'index'])->name('home');
Route::get('catalogo/{comercio:slug}', [PublicCatalogController::class, 'show'])->name('catalogo.show');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Admin CRUDs para Catálogo Capsur
        Route::prefix('admin')->as('admin.')->group(function () {
            // Grupos
            Route::get('grupos', [GrupoController::class, 'index'])->name('grupos.index');
            Route::post('grupos', [GrupoController::class, 'store'])->name('grupos.store');
            Route::put('grupos/{grupo}', [GrupoController::class, 'update'])->name('grupos.update');
            Route::delete('grupos/{grupo}', [GrupoController::class, 'destroy'])->name('grupos.destroy');

            // Comercios
            Route::get('comercios', [ComercioController::class, 'index'])->name('comercios.index');
            Route::get('comercios/{comercio}/edit', [ComercioController::class, 'edit'])->name('comercios.edit');
            Route::post('comercios', [ComercioController::class, 'store'])->name('comercios.store');
            Route::put('comercios/{comercio}', [ComercioController::class, 'update'])->name('comercios.update');
            Route::delete('comercios/{comercio}', [ComercioController::class, 'destroy'])->name('comercios.destroy');

            // Carreras / Programas
            Route::get('carreras', [CarreraController::class, 'index'])->name('carreras.index');
            Route::post('carreras', [CarreraController::class, 'store'])->name('carreras.store');
            Route::put('carreras/{carrera}', [CarreraController::class, 'update'])->name('carreras.update');
            Route::delete('carreras/{carrera}', [CarreraController::class, 'destroy'])->name('carreras.destroy');

            // Diplomados
            Route::get('diplomados', [\App\Http\Controllers\Admin\DiplomadoController::class, 'index'])->name('diplomados.index');
            Route::post('diplomados', [\App\Http\Controllers\Admin\DiplomadoController::class, 'store'])->name('diplomados.store');
            Route::put('diplomados/{diplomado}', [\App\Http\Controllers\Admin\DiplomadoController::class, 'update'])->name('diplomados.update');
            Route::delete('diplomados/{diplomado}', [\App\Http\Controllers\Admin\DiplomadoController::class, 'destroy'])->name('diplomados.destroy');

            // Cursos
            Route::get('cursos', [\App\Http\Controllers\Admin\CursoController::class, 'index'])->name('cursos.index');
            Route::post('cursos', [\App\Http\Controllers\Admin\CursoController::class, 'store'])->name('cursos.store');
            Route::put('cursos/{curso}', [\App\Http\Controllers\Admin\CursoController::class, 'update'])->name('cursos.update');
            Route::delete('cursos/{curso}', [\App\Http\Controllers\Admin\CursoController::class, 'destroy'])->name('cursos.destroy');
        });
    });

Route::middleware(['auth'])->group(function () {
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
