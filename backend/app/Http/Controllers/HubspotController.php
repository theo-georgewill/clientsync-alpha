<?php
// app/Http/Controllers/HubSpotController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\HubSpotService;

class HubSpotController extends Controller
{
    protected HubSpotService $hubspot;

    public function __construct(HubSpotService $hubspot)
    {
        $this->hubspot = $hubspot;
    }

    // Redirect to HubSpot OAuth page
    public function redirectToHubSpot()
    {
        return redirect()->away($this->hubspot->getAuthUrl());
    }

    // Handle callback from HubSpot after user authorization
    public function handleCallback(Request $request)
    {
        $tokens = $this->hubspot->fetchAccessToken($request->code);

        // TODO: Save tokens to DB with associated user/account

        return response()->json([
            'message' => 'HubSpot connected!',
            'tokens' => $tokens
        ]);
    }
}
