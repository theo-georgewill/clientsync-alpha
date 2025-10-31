<?php

namespace App\Services\Hubspot;

use App\Models\HubspotAccount;
use Illuminate\Support\Facades\Log;

class HubspotTokenManager
{
    protected HubspotService $hubspotService;

    public function __construct(HubspotService $hubspotService)
    {
        $this->hubspotService = $hubspotService;
    }
    /**
     * Get a valid access token for a given Hubspot account.
     */
    public function getAccessTokenFromAccount(HubspotAccount $account): string
    {
        if (empty($account->refresh_token)) {
            throw new \Exception('No refresh token available for this Hubspot account.');
        }

        if ($account->isExpired()) {
            $account = $this->refreshToken($account);
        }

        return $account->access_token;
    }


    /**
     * Get a valid access token for a given user.
     */
    public function getAccessToken(int $userId): string
    {
        $account = HubspotAccount::where('user_id', $userId)->firstOrFail();

        if (empty($account->refresh_token)) {
            throw new \Exception('No refresh token available for this account.');
        }

        if ($account->isExpired()) {
            $account = $this->refreshToken($account);
        }

        return $account->access_token;
    }

    /**
     * Refresh the access token.
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
     * Store the initial tokens after authorization.
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
