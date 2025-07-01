<?php
// app/Services/Hubspot/HubSpotTokenManager.php

namespace App\Services\Hubspot;

use App\Models\HubspotAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class HubSpotTokenManager
{
    protected HubSpotService $hubspotService;

    public function __construct()
    {
        $this->hubspotService = new HubSpotService(); // optional: inject if needed
    }

    /**
     * Get a valid access token for the given user.
     */
    public function getAccessToken(int $userId): string
    {
        $account = HubspotAccount::where('user_id', $userId)->firstOrFail();

        // Check if token is expired
        if (now()->greaterThan($account->expires_at)) {
            $account = $this->refreshToken($account);
        }

        return $account->access_token;
    }

    /**
     * Refresh the access token using HubSpot's refresh_token flow.
     */
    public function refreshToken(HubspotAccount $account): HubspotAccount
    {
        $response = $this->hubspotService->refreshAccessToken($account->refresh_token);

        if (!isset($response['access_token'])) {
            Log::error('Failed to refresh HubSpot token', ['response' => $response]);
            throw new \Exception('Unable to refresh HubSpot token.');
        }

        $account->update([
            'access_token' => $response['access_token'],
            'refresh_token' => $response['refresh_token'] ?? $account->refresh_token,
            'expires_at' => now()->addSeconds($response['expires_in']),
        ]);

        return $account;
    }

    /**
     * Save the initial token set after first authorization.
     */
    public function storeInitialTokens(int $userId, array $tokens): HubspotAccount
    {
        return HubspotAccount::updateOrCreate(
            ['user_id' => $userId],
            [
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at' => now()->addSeconds($tokens['expires_in']),
                'scopes' => $tokens['scope'] ?? [],
            ]
        );
    }
}
