<?php

use App\Http\Controllers\Admin\CarreraController;
use App\Http\Controllers\Admin\ComercioController;
use App\Http\Controllers\Admin\CursoController;
use App\Http\Controllers\Admin\DiplomadoController;
use App\Http\Controllers\Admin\DriveCapacitacionController;
use App\Http\Controllers\Admin\GrupoController;
use App\Http\Controllers\Admin\LogoController;
use App\Http\Controllers\Admin\RubroController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicCatalogController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicCatalogController::class, 'index'])->name('home');
Route::get('login', fn () => redirect('/?login=1'))->name('login');
Route::get('catalogo/{comercio:slug}', [PublicCatalogController::class, 'show'])->name('catalogo.show');

Route::middleware(['auth', 'verified'])->group(function () {
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
        Route::get('diplomados', [DiplomadoController::class, 'index'])->name('diplomados.index');
        Route::post('diplomados', [DiplomadoController::class, 'store'])->name('diplomados.store');
        Route::put('diplomados/{diplomado}', [DiplomadoController::class, 'update'])->name('diplomados.update');
        Route::delete('diplomados/{diplomado}', [DiplomadoController::class, 'destroy'])->name('diplomados.destroy');

        // Cursos
        Route::get('cursos', [CursoController::class, 'index'])->name('cursos.index');
        Route::post('cursos', [CursoController::class, 'store'])->name('cursos.store');
        Route::put('cursos/{curso}', [CursoController::class, 'update'])->name('cursos.update');
        Route::delete('cursos/{curso}', [CursoController::class, 'destroy'])->name('cursos.destroy');

        // Drive Capacitaciones
        Route::get('drive-capacitaciones', [DriveCapacitacionController::class, 'edit'])->name('drive-capacitaciones.edit');
        Route::put('drive-capacitaciones', [DriveCapacitacionController::class, 'update'])->name('drive-capacitaciones.update');

        // Rubros
        Route::get('rubros', [RubroController::class, 'index'])->name('rubros.index');
        Route::post('rubros', [RubroController::class, 'store'])->name('rubros.store');
        Route::put('rubros/{rubro}', [RubroController::class, 'update'])->name('rubros.update');
        Route::delete('rubros/{rubro}', [RubroController::class, 'destroy'])->name('rubros.destroy');

        // Logos
        Route::get('logos', [LogoController::class, 'index'])->name('logos.index');
        Route::post('logos/{comercio}', [LogoController::class, 'update'])->name('logos.update');
    });
});

require __DIR__.'/settings.php';
