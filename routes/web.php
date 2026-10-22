<?php

use App\Http\Controllers\Admin\CarreraController;
use App\Http\Controllers\Admin\ComercioController;
use App\Http\Controllers\Admin\ContactoController;
use App\Http\Controllers\Admin\CursoController;
use App\Http\Controllers\Admin\DiplomadoController;
use App\Http\Controllers\Admin\EspecialidadController;
use App\Http\Controllers\Admin\EstadoController;
use App\Http\Controllers\Admin\GrupoController;
use App\Http\Controllers\Admin\LogoController;
use App\Http\Controllers\Admin\RubroController;
use App\Http\Controllers\Admin\TrainingAreaController;
use App\Http\Controllers\Admin\TrainingFileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CapacitadoChatController;
use App\Http\Controllers\CapacitadoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicCatalogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['redirect.from.public'])->group(function () {
    Route::get('/', [PublicCatalogController::class, 'index'])->name('home');
    Route::get('login', fn () => redirect('/?login=1'))->name('login');
    Route::get('catalogo/{comercio:slug}', [PublicCatalogController::class, 'show'])->name('catalogo.show');
});

// Portal para rol CAPACITADO (usuarios autenticados)
Route::middleware(['auth', 'verified', 'capacitado', 'capacitado.area'])->prefix('capacitado')->as('capacitado.')->group(function () {
    Route::get('/', [CapacitadoController::class, 'index'])->name('index');
    Route::get('venta', [CapacitadoController::class, 'venta'])->name('venta');
    Route::get('postventa', [CapacitadoController::class, 'postventa'])->name('postventa');
    Route::get('informatica', [CapacitadoController::class, 'informatica'])->name('informatica');
    Route::get('marketing', [CapacitadoController::class, 'marketing'])->name('marketing');
    Route::get('academico', [CapacitadoController::class, 'academico'])->name('academico');
    Route::get('area/{trainingArea:slug}', [CapacitadoController::class, 'area'])->name('area');
    Route::get('archivos/{trainingFileNode}/download', [CapacitadoController::class, 'download'])->name('archivos.download');
    Route::get('archivos/{trainingFileNode}/view', [CapacitadoController::class, 'view'])->name('archivos.view');
    Route::post('chat', [CapacitadoChatController::class, 'chat'])->name('chat');
});

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
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

        // Especialidades
        Route::get('especialidades', [EspecialidadController::class, 'index'])->name('especialidades.index');
        Route::post('especialidades', [EspecialidadController::class, 'store'])->name('especialidades.store');
        Route::put('especialidades/{especialidad}', [EspecialidadController::class, 'update'])->name('especialidades.update');
        Route::delete('especialidades/{especialidad}', [EspecialidadController::class, 'destroy'])->name('especialidades.destroy');

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

        // Rubros
        Route::get('rubros', [RubroController::class, 'index'])->name('rubros.index');
        Route::post('rubros', [RubroController::class, 'store'])->name('rubros.store');
        Route::put('rubros/{rubro}', [RubroController::class, 'update'])->name('rubros.update');
        Route::delete('rubros/{rubro}', [RubroController::class, 'destroy'])->name('rubros.destroy');

        // Estados
        Route::get('estados', [EstadoController::class, 'index'])->name('estados.index');
        Route::post('estados', [EstadoController::class, 'store'])->name('estados.store');
        Route::put('estados/{estado}', [EstadoController::class, 'update'])->name('estados.update');
        Route::delete('estados/{estado}', [EstadoController::class, 'destroy'])->name('estados.destroy');

        // Logos
        Route::get('logos', [LogoController::class, 'index'])->name('logos.index');
        Route::post('logos/{comercio}', [LogoController::class, 'update'])->name('logos.update');

        // Contacto Institucional
        Route::get('contacto', [ContactoController::class, 'edit'])->name('contacto.edit');
        Route::put('contacto', [ContactoController::class, 'update'])->name('contacto.update');
        Route::get('capacitacion', [TrainingAreaController::class, 'index'])->name('capacitacion.index');
        Route::post('capacitacion/areas', [TrainingAreaController::class, 'store'])->name('capacitacion.areas.store');
        Route::put('capacitacion/areas/{trainingArea}', [TrainingAreaController::class, 'update'])->name('capacitacion.areas.update');
        Route::delete('capacitacion/areas/{trainingArea}', [TrainingAreaController::class, 'destroy'])->name('capacitacion.areas.destroy');
        Route::post('capacitacion/areas/{trainingArea}/documents', [TrainingAreaController::class, 'storeDocument'])->name('capacitacion.documents.store');
        Route::patch('capacitacion/documents/{trainingDocument}/status', [TrainingAreaController::class, 'updateDocumentStatus'])->name('capacitacion.documents.status');
        Route::delete('capacitacion/documents/{trainingDocument}', [TrainingAreaController::class, 'destroyDocument'])->name('capacitacion.documents.destroy');
        Route::get('archivos', [TrainingFileController::class, 'index'])->name('archivos.index');
        Route::delete('archivos/nodes/{trainingFileNode}', [TrainingFileController::class, 'destroy'])->name('archivos.nodes.destroy');
        Route::get('archivos/nodes/{trainingFileNode}/download', [TrainingFileController::class, 'download'])->name('archivos.download');
        Route::get('archivos/{trainingArea:slug}', [TrainingFileController::class, 'show'])->name('archivos.show');
        Route::post('archivos/{trainingArea:slug}/folders', [TrainingFileController::class, 'storeFolder'])->name('archivos.folders.store');
        Route::post('archivos/{trainingArea:slug}/files', [TrainingFileController::class, 'storeFile'])->name('archivos.files.store');
        Route::resource('usuarios', UserController::class)
            ->parameters(['usuarios' => 'user'])
            ->only(['index', 'store', 'update', 'destroy']);
        Route::patch('usuarios/{user}/toggle-enabled', [UserController::class, 'toggleEnabled'])->name('usuarios.toggle-enabled');
    });
});

require __DIR__.'/settings.php';
