# 🚀 Guía de Despliegue Manual a VPS (Actualización Integral: Oferta Formativa & Especialidades)

Esta guía contiene la lista exhaustiva de todos los archivos modificados y creados desde la versión 1.0 (`f39a251`) hasta la versión actual (`HEAD`), junto con los pasos paso a paso para desplegar en tu servidor VPS.

---

## 📦 1. Paquetes ZIP Listos en tu Proyecto Local

Para tu comodidad, se han generado en la raíz de tu proyecto local:
1. **`deploy-cambios.zip`** (105 KB): Contiene **TODOS** los archivos de código PHP, migraciones, modelos, controladores y componentes TypeScript modificados/creados (respetando su estructura de carpetas).
2. **`deploy-public-build.zip`** (660 KB): Contiene la carpeta compilada **`public/build`** lista para producción, por si tu VPS no tiene Node.js/NPM o prefieres no compilar allí.

---

## 📋 2. Inventario Completo de Archivos Modificados y Creados (Desde v1.0 `f39a251`)

### A. Modelos Eloquent (`app/Models/`)
- `app/Models/Carrera.php` *(Modificado: añadida relación `especialidades(): HasMany`)*
- `app/Models/Comercio.php` *(Modificado: añadida relación `especialidades(): HasManyThrough`)*
- `app/Models/Especialidad.php` *(**NUEVO**: modelo con relaciones a Carrera y Rubro)*
- `app/Models/Rubro.php` *(Modificado: añadida relación `especialidades(): HasMany`)*

### B. Controladores Backend (`app/Http/Controllers/Admin/`)
- `app/Http/Controllers/Admin/CarreraController.php` *(Modificado: eager loading y selección de siglas/logos)*
- `app/Http/Controllers/Admin/ComercioController.php` *(Modificado: carga de oferta formativa integral y conteo)*
- `app/Http/Controllers/Admin/CursoController.php` *(Modificado: iconos formales y selección de logos)*
- `app/Http/Controllers/Admin/DiplomadoController.php` *(Modificado: iconos formales y selección de logos)*
- `app/Http/Controllers/Admin/EspecialidadController.php` *(**NUEVO**: CRUD completo de especialidades)*
- `app/Http/Controllers/Admin/RubroController.php` *(Modificado: protección de eliminación con especialidades)*

### C. Base de Datos (`database/`)
- `database/migrations/2026_09_14_000001_create_especialidades_table.php` *(**NUEVA MIGRACIÓN**: crea tabla `especialidades`)*
- `database/migrations/2026_09_15_000001_add_rubro_id_to_especialidades_table.php` *(**NUEVA MIGRACIÓN**: añade clave foránea `rubro_id` obligatoria)*
- `database/factories/EspecialidadFactory.php` *(**NUEVO**)*
- `database/factories/RubroFactory.php` *(**NUEVO**)*
- `database/seeders/DatabaseSeeder.php` *(Modificado: seeders eliminados y deshabilitados para proteger datos en producción)*

### D. Rutas (`routes/`)
- `routes/web.php` *(Modificado: registradas las rutas `admin.especialidades`)*

### E. Frontend - Componentes UI (`resources/js/components/`)
- `resources/js/components/app-sidebar.tsx` *(Modificado: menú limpio enfocado en Comercios e Institutos)*
- `resources/js/components/admin/comercio-badge.tsx` *(**NUEVO**: renderizado de fotos/logos o siglas de comercios)*
- `resources/js/components/admin/especialidad-dialog.tsx` *(**NUEVO**: modal CRUD de especialidades con rubro obligatorio)*
- `resources/js/components/admin/carrera-dialog.tsx` *(Modificado: selector con insignias fotográficas/siglas)*
- `resources/js/components/admin/curso-dialog.tsx` *(Modificado: reemplazo de emojis por iconos formales y badges)*
- `resources/js/components/admin/diplomado-dialog.tsx` *(Modificado: reemplazo de emojis por iconos formales y badges)*

### F. Frontend - Páginas Administrativas (`resources/js/pages/admin/`)
- `resources/js/pages/admin/comercios/edit.tsx` *(Modificado: Oferta Formativa integral siempre visible, creación in-situ, botonera rápida y acordeones)*
- `resources/js/pages/admin/comercios/index.tsx` *(Modificado: columna y tarjetas con botón de acceso a Oferta Formativa y recuento)*
- `resources/js/pages/admin/especialidades/index.tsx` *(**NUEVA PÁGINA**: catálogo general de especialidades con banner de retorno)*
- `resources/js/pages/admin/carreras/index.tsx` *(Modificado: banner contextual de retorno)*
- `resources/js/pages/admin/cursos/index.tsx` *(Modificado: banner contextual de retorno e iconos formales)*
- `resources/js/pages/admin/diplomados/index.tsx` *(Modificado: banner contextual de retorno e iconos formales)*
- `resources/js/pages/admin/rubros/index.tsx` *(Modificado: iconos formales Material UI)*

### G. Tipos TypeScript (`resources/js/types/`)
- `resources/js/types/capsur.ts` *(Modificado: interfaz `Especialidad`, campos `especialidades` y `especialidades_count`)*

### H. Tests (`tests/`)
- `tests/Unit/EspecialidadUnitTest.php` *(**NUEVO**: 7 tests unitarios)*
- `tests/Feature/Admin/EspecialidadManagementTest.php` *(**NUEVO**: 6 tests de integración)*

---

## 🛠️ 3. Procedimiento de Despliegue en el VPS

### Paso 3.1: (Recomendado) Backup previo de seguridad
```bash
cd /ruta/hacia/tu/proyecto  # Ej: cd /var/www/corporacion

# Backup de base de datos
mysqldump -u tu_usuario_bd -p tu_nombre_bd > backup_antes_deploy_$(date +%F).sql
```

---

### Paso 3.2: Reemplazar los Archivos en el VPS

#### Opción A: Mediante Git (La más rápida y limpia)
Como ya hiciste `git push` a GitHub con todos estos cambios, si tu VPS está conectado al repositorio:
```bash
git pull origin main
```

#### Opción B: Mediante el archivo ZIP generado (`deploy-cambios.zip`)
1. Sube `deploy-cambios.zip` a la raíz de tu proyecto en el VPS (vía SCP, FileZilla, SFTP o cPanel).
2. En la terminal de tu VPS:
   ```bash
   unzip -o deploy-cambios.zip
   rm deploy-cambios.zip
   ```

---

### Paso 3.3: Permisos en Linux
```bash
# Asignar propiedad al usuario del servidor web
sudo chown -R www-data:www-data .

# Permisos para carpetas de almacenamiento y caché
sudo chmod -R 775 storage bootstrap/cache
```

---

### Paso 3.4: Ejecutar Migraciones de Base de Datos
Este paso creará la tabla `especialidades` y aplicará la relación `rubro_id`:
```bash
php artisan migrate --force
```

---

### Paso 3.5: Actualizar Assets Frontend

- **Si tu VPS tiene Node.js y NPM instalado:**
  ```bash
  npm run build
  ```
- **Si tu VPS NO tiene Node.js instalado:**
  Sube el archivo `deploy-public-build.zip` al VPS y descomprímelo dentro de la carpeta `public`:
  ```bash
  # En la raíz del proyecto:
  unzip -o deploy-public-build.zip
  rm deploy-public-build.zip
  ```

---

### Paso 3.6: Limpiar y Regenerar Cachés de Producción
```bash
# Limpiar cachés anteriores
php artisan optimize:clear

# Regenerar cachés de producción
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔍 4. Verificación Post-Despliegue

1. **Sidenav:** Ingresa a `/admin/comercios`. Verifica que el menú lateral solo muestre *Comercios e Institutos*, *Grupos Comerciales*, *Rubros*, *Drive Capacitaciones* y *Logos*.
2. **Oferta Formativa:**
   - Abre cualquier comercio (ej. AVANTI).
   - Haz clic en la pestaña **Oferta Formativa**.
   - Comprueba que aparezca la barra superior con los botones:
     - `+ Nueva Carrera`
     - `+ Nueva Especialidad`
     - `+ Nuevo Diplomado`
     - `+ Nuevo Curso`
   - Comprueba que las 3 secciones (*Carreras*, *Diplomados*, *Cursos*) estén visibles con sus tarjetas y botones de registro funcionales.
3. **Creación In-Situ:**
   - Abre el modal de `+ Nueva Especialidad` y verifica que cargue el selector de Rubro formal (con iconos y sin emojis).
