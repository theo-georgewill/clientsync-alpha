<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleHubspot(Request $request)
    {
        // Verify HubSpot signature if needed
        // $signature = $request->header('X-HubSpot-Signature-v3');

        // Log the webhook payload
        Log::channel('webhook')->info('HubSpot Webhook received', [
            'payload' => $request->all(),
            'headers' => $request->headers->all(),
            'timestamp' => now()->toDateTimeString()
        ]);

        // Handle different subscription types
        $subscriptionType = $request->input('subscriptionType');
        $objectType = $request->input('objectType');

        switch ($subscriptionType) {
            case 'contact.creation':
                // Handle contact creation
                break;
            case 'contact.propertyChange':
                // Handle property changes
                break;
            case 'contact.deletion':
                // Handle contact deletion
                break;
        }

        return response()->json(['status' => 'success']);
    }
}
