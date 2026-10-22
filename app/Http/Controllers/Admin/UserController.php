<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\TrainingArea;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $role = $request->query('role', 'all');

        $users = User::query()
            ->with(['rol:id,nombre,slug', 'trainingArea:id,name,slug'])
            ->whereHas('rol', fn ($query) => $query->whereIn('slug', ['admin', 'capacitado']))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($nested) use ($search): void {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(in_array($role, ['admin', 'capacitado'], true), fn ($query) => $query->whereHas(
                'rol',
                fn ($roleQuery) => $roleQuery->where('slug', $role)
            ))
            ->orderBy('name')
            ->get(['id', 'rol_id', 'training_area_id', 'name', 'email', 'is_enabled', 'created_at']);

        $roles = Rol::query()
            ->whereIn('slug', ['admin', 'capacitado'])
            ->orderByRaw("FIELD(slug, 'admin', 'capacitado')")
            ->get(['id', 'nombre', 'slug', 'descripcion']);

        return Inertia::render('admin/usuarios/index', [
            'users' => $users,
            'roles' => $roles,
            'trainingAreas' => TrainingArea::query()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => ['search' => $search, 'role' => $role],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        User::create([
            'rol_id' => $data['rol_id'],
            'training_area_id' => $this->trainingAreaId($data),
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'],
            'email_verified_at' => now(),
            'is_enabled' => $data['is_enabled'] ?? true,
        ]);

        return back()->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $this->validated($request, $user);
        $newRole = Rol::findOrFail($data['rol_id']);

        if ($user->is($request->user()) && $newRole->slug !== 'admin') {
            return back()->withErrors(['rol_id' => 'No puedes quitarte el rol ADMIN de tu propia cuenta.']);
        }

        if ($user->esAdministrador() && $newRole->slug !== 'admin' && $this->isLastAdmin($user)) {
            return back()->withErrors(['rol_id' => 'No puedes quitar el rol del último administrador.']);
        }

        $attributes = [
            'rol_id' => $data['rol_id'],
            'training_area_id' => $this->trainingAreaId($data),
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'is_enabled' => $data['is_enabled'] ?? $user->is_enabled,
        ];
        if (! empty($data['password'])) {
            $attributes['password'] = $data['password'];
        }

        $user->update($attributes);

        return back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function toggleEnabled(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user()) && $user->is_enabled) {
            return back()->withErrors(['user' => 'No puedes deshabilitar tu propia cuenta.']);
        }

        if ($user->esAdministrador() && $user->is_enabled && $this->isLastEnabledAdmin($user)) {
            return back()->withErrors(['user' => 'No puedes deshabilitar al último administrador habilitado.']);
        }

        $user->update(['is_enabled' => ! $user->is_enabled]);

        return back();
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->withErrors(['user' => 'No puedes eliminar tu propia cuenta desde este módulo.']);
        }

        if ($user->esAdministrador() && $this->isLastAdmin($user)) {
            return back()->withErrors(['user' => 'No puedes eliminar el último administrador del sistema.']);
        }

        $user->delete();

        return back()->with('success', 'Usuario eliminado correctamente.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?User $user = null): array
    {
        $passwordRules = $user
            ? ['nullable', 'string', 'min:8', 'confirmed']
            : ['required', 'string', 'min:8', 'confirmed'];

        return $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'rol_id' => ['required', 'integer', Rule::exists('roles', 'id')->where(
                fn ($query) => $query->whereIn('slug', ['admin', 'capacitado'])
            )],
            'training_area_id' => ['nullable', 'integer', Rule::exists('training_areas', 'id')->where(fn ($query) => $query->where('is_active', true))],
            'password' => $passwordRules,
            'is_enabled' => ['boolean'],
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Ese correo electrónico ya está registrado.',
            'rol_id.required' => 'Selecciona un rol.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
            'password.required' => 'La contraseña es obligatoria al crear el usuario.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
        ]);
    }

    private function trainingAreaId(array $data): ?int
    {
        $role = Rol::findOrFail($data['rol_id']);

        if ($role->slug === 'capacitado' && empty($data['training_area_id'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'training_area_id' => 'El rol CAPACITADO requiere un área de capacitación.',
            ]);
        }

        return $role->slug === 'capacitado' ? (int) $data['training_area_id'] : null;
    }

    private function isLastAdmin(User $user): bool
    {
        return User::where('id', '!=', $user->id)
            ->whereHas('rol', fn ($query) => $query->where('slug', 'admin'))
            ->doesntExist();
    }

    private function isLastEnabledAdmin(User $user): bool
    {
        return User::where('id', '!=', $user->id)
            ->where('is_enabled', true)
            ->whereHas('rol', fn ($query) => $query->where('slug', 'admin'))
            ->doesntExist();
    }
}
