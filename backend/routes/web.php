<?php
use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    return response()->json([
        'message' => 'Route not found.'
    ], 404);
});
