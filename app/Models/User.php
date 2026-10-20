<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property int|null $rol_id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Rol|null $rol
 */
#[Fillable(['rol_id', 'name', 'email', 'password', 'email_verified_at', 'is_enabled'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_enabled' => 'boolean',
        ];
    }

    protected $appends = [
        'es_admin',
        'es_capacitado',
    ];

    /**
     * Accesor para saber si el usuario es administrador en el frontend.
     */
    public function getEsAdminAttribute(): bool
    {
        return $this->esAdministrador();
    }

    /**
     * Accesor para saber si el usuario es capacitado en el frontend.
     */
    public function getEsCapacitadoAttribute(): bool
    {
        return $this->esCapacitado();
    }

    /**
     * Rol asignado al usuario.
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    /**
     * Comprueba si el usuario tiene rol de administrador.
     */
    public function esAdministrador(): bool
    {
        $slug = strtolower($this->rol?->slug ?? '');
        $nombre = strtoupper($this->rol?->nombre ?? '');

        return in_array($slug, ['admin', 'administrador']) || in_array($nombre, ['ADMIN', 'ADMINISTRADOR']);
    }

    /**
     * Alias de esAdministrador.
     */
    public function esAdmin(): bool
    {
        return $this->esAdministrador();
    }

    /**
     * Comprueba si el usuario tiene rol de capacitado.
     */
    public function esCapacitado(): bool
    {
        $slug = strtolower($this->rol?->slug ?? '');
        $nombre = strtoupper($this->rol?->nombre ?? '');

        return $slug === 'capacitado' || $nombre === 'CAPACITADO';
    }
}
