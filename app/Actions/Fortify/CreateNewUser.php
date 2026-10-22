<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'rol_id' => ['required', 'integer', 'exists:roles,id'],
            'training_area_id' => [
                'nullable',
                'integer',
                Rule::exists('training_areas', 'id')->where(fn ($query) => $query->where('is_active', true)),
                Rule::requiredIf(fn () => optional(\App\Models\Rol::find($input['rol_id'] ?? null))->slug === 'capacitado'),
            ],
        ], [
            'rol_id.required' => 'Debes seleccionar un rol para la cuenta.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
        ])->validate();

        $role = Rol::findOrFail((int) $input['rol_id']);

        return DB::transaction(function () use ($input, $role) {
            return User::create([
                'rol_id' => (int) $input['rol_id'],
            'training_area_id' => $role->slug === 'capacitado' ? (int) $input['training_area_id'] : null,
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);
        });
    }
}
