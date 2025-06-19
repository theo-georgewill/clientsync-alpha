<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HubSpotController;
use App\Http\Controllers\AuthController;
use App\Models\User;

// Login
Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);//needs web middleware group
});
    Route::get('/hubspot/callback', [HubSpotController::class, 'handleCallback']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', [AuthController::class, 'user']);//needs auth:sanctum to ensure csrf

    // Add other protected routes here
    //Route::get('/contacts', [ContactController::class, 'index']);

    Route::get('/hubspot/connect', [HubSpotController::class, 'redirectToHubSpot']);
    Route::get('/hubspot/auth-url', [HubSpotController::class, 'getAuthUrl']);
    Route::get('/hubspot/status', [HubSpotController::class, 'status']);
    Route::post('/hubspot/disconnect', [HubSpotController::class, 'disconnect']);
});

