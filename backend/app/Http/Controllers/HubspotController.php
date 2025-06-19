<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\HubSpotService;
use App\Models\User;

class HubSpotController extends Controller
{
    protected HubSpotService $hubspot;

    public function __construct(HubSpotService $hubspot)
    {
        $this->hubspot = $hubspot;
    }

    /**
     * Step 1: Return HubSpot OAuth URL to frontend
     */
    public function getAuthUrl()
    {
        return response()->json([
            'url' => $this->hubspot->getAuthUrl()
        ]);
    }

    /**
     * Step 2: Handle HubSpot OAuth callback from frontend
     * Frontend should POST the `code` here after receiving it
     */
    public function handleCallback(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $tokens = $this->hubspot->fetchAccessToken($request->code);

        if (!isset($tokens['access_token'])) {
            return response()->json(['error' => 'Failed to retrieve access token'], 500);
        }

        //$user = Auth::user();
        $user = User::find(1);

        $user->hubspotAccount()->updateOrCreate([], [
            'access_token' => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'],
            'expires_at' => now()->addSeconds($tokens['expires_in']),
            'hubspot_user_id' => $tokens['hub_id'] ?? null,
            'scopes' => explode(' ', $tokens['scope'] ?? ''),
        ]);

        return response()->json(['message' => 'HubSpot connected successfully']);
    }

    public function status()
    {
       // $user = auth()->user();
       $user = User::find(1);
        $account = $user->hubspotAccount;

        if (!$account) {
            return response()->json(['connected' => false]);
        }

        return response()->json([
            'connected' => true,
            'last_synced' => $account->updated_at->toDateTimeString(),
            'scopes' => $account->scopes ?? [],
        ]);
    }

    public function disconnect()
    {
        $user = auth()->user();

        $hubspotAccount = $user->hubspotAccount;

        if ($hubspotAccount) {
            $hubspotAccount->delete(); // soft delete
        }

        return response()->json(['message' => 'HubSpot disconnected successfully.']);
    }

}
