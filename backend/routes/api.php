<?php

use Illuminate\Support\Facades\Route;

// La API de la aplicación se conectará a estas tablas en una siguiente etapa.
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
