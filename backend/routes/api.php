<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HubSpotController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\PipelineController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\WebhookController;
use App\Models\User;


//Hubspot Webhook. No auth needed as HubSpot uses secret key verification
Route::post('/webhooks/hubspot', [WebhookController::class, 'handleHubspot']);

// Login routes. Need web middleware for session management
Route::middleware(['web'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);//needs web middleware group
});

//Api routes that need authentication
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', [AuthController::class, 'user']);//needs auth:sanctum to ensure csrf

    // Add other protected routes here
    //Route::get('/contacts', [ContactController::class, 'index']);

    Route::get('/hubspot/connect', [HubSpotController::class, 'redirectToHubSpot']);
    Route::get('/hubspot/auth-url', [HubSpotController::class, 'getAuthUrl']);
    Route::get('/hubspot/status', [HubSpotController::class, 'status']);
    Route::post('/hubspot/disconnect', [HubSpotController::class, 'disconnect']);
    Route::post('/hubspot/callback', [HubSpotController::class, 'handleCallback']);
    Route::post('/hubspot/sync', [HubSpotController::class, 'sync']);

    // Pipelines with stages
    Route::get('/pipelines', [PipelineController::class, 'index']);
    // Deals list (with pipeline & stage)
    Route::get('/deals', [DealController::class, 'index']);
    // Create deal protected route
    Route::post('/deals', [DealController::class, 'store']);
    // Update deal stage (for drag & drop)
    Route::patch('/deals/{id}', [DealController::class, 'update']);


    // Contacts list
    Route::get('/contacts', [ContactController::class, 'index']);
    // Create contact protected route
    Route::post('/contacts', [ContactController::class, 'store']);
    // Update contact
    Route::patch('/contacts/{id}', [ContactController::class, 'update']);

    // Activities
    Route::get('/activities', [ActivityController::class, 'index']);

});

