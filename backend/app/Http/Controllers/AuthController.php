<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $datos = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $usuario = User::create([
        'name' => $datos['name'],
        'email' => $datos['email'],
        'password' => Hash::make($datos['password']),
        ]);

        // Asignar automáticamente el rol de emprendedor
        $rol = \App\Models\Role::where('name', 'emprendedor')->firstOrFail();

        $usuario->roles()->attach($rol->id);

        // Iniciar sesión
        Auth::login($usuario);
        $request->session()->regenerate();

        Auth::login($usuario);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Usuario registrado',
            'user' => $usuario
        ], 201);
    }

    public function login(Request $request)
    {
        $datos = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($datos)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas.']
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Sesión iniciada',
            'user' => Auth::user()
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada'
        ]);
    }

    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }
}
