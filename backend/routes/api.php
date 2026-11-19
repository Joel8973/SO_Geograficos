<?php

use App\Models\Establishment;

Route::get('/establishments', function () {
    return response()->json(
        Establishment::all()
    );
});
