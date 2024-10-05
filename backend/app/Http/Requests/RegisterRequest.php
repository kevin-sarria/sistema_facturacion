<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as PasswordRules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'unique:users,email'],
            'name' => ['required', 'string'],
            'password' => [
                'required',
                'confirmed',
                PasswordRules::min(8)->letters()->numbers()->symbols()
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El Email es Obligatorio',
            'email.email' => 'El Email ingresado no es valido',
            'email.unique' => 'El usuario ya se encuentra registrado',
            'name.required' => 'El nombre de usuario es Obligatorio',
            'password' => 'El password debe contener al menos 8 caracteres, entre ellos, letras, numeros y simbolos'
        ];
    }
}
