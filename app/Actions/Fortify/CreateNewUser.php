<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
        ], [
            'rol_id.required' => 'Debes seleccionar un rol para la cuenta.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
        ])->validate();

        return DB::transaction(function () use ($input) {
            return User::create([
                'rol_id' => (int) $input['rol_id'],
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);
        });
    }
}
