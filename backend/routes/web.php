
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// Página principal
Route::get('/', function () {
    return view('inicio');
});

// Rutas de autenticación
Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

});

// Rutas de productos protegidas por autenticación
Route::middleware('auth')->prefix('api')->group(function () {

    Route::get('/products', [ProductController::class, 'index']);

    Route::post('/products', [ProductController::class, 'store']);

    Route::put('/products/{product}', [ProductController::class, 'update']);

    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

});
