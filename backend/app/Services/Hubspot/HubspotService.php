<?php

namespace App\Services\Hubspot;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\HubspotAccount;

class HubspotService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;

    public function __construct()
    {
        $this->clientId = config('services.hubspot.client_id');
        $this->clientSecret = config('services.hubspot.client_secret');
        $this->redirectUri = config('services.hubspot.redirect');
    }

    /**
     * Generate HubSpot authorization URL for OAuth.
     */
    public function getAuthUrl(): string
    {
        $query = http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => 'oauth crm.objects.contacts.read crm.objects.contacts.write crm.objects.deals.read crm.objects.deals.write crm.objects.companies.read crm.objects.companies.write',
            'response_type' => 'code',
        ]);

        return "https://app.hubspot.com/oauth/authorize?$query";
    }

    /**
     * Exchange authorization code for access + refresh tokens.
     */
    public function fetchAccessToken(string $code): array
    {
        return Http::asForm()->post('https://api.hubapi.com/oauth/v1/token', [
            'grant_type' => 'authorization_code',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'code' => $code,
        ])->json();
    }

    /**
     * Refresh the access token.
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        return Http::asForm()->post('https://api.hubapi.com/oauth/v1/token', [
            'grant_type' => 'refresh_token',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $refreshToken,
        ])->json();
    }

    /**
     * Get HubSpot user info for a given access token.
     */
    public function getTokenInfo(string $accessToken): array
    {
        return Http::withToken($accessToken)
            ->get('https://api.hubapi.com/oauth/v1/access-tokens/' . $accessToken)
            ->json();
    }

    /**
     * Get contacts list.
     */
    public function getContacts(HubspotAccount $account, HubSpotTokenManager $tokenManager): array
    {
        $token = $tokenManager->getAccessTokenFromAccount($account);

        return Http::withToken($token)
            ->get('https://api.hubapi.com/crm/v3/objects/contacts')
            ->json();
    }

    /**
     * Get contacts with details.
     */
    public function getContactsWithDetails(HubspotAccount $account, HubSpotTokenManager $tokenManager): array
    {
        $token = $tokenManager->getAccessTokenFromAccount($account);

        return Http::withToken($token)
            ->get('https://api.hubapi.com/crm/v3/objects/contacts?properties=email,firstname,lastname&limit=100')
            ->json();
    }

    /**
     * Get deals.
     */
    public function getDeals(HubspotAccount $account, HubSpotTokenManager $tokenManager): array
    {
        $token = $tokenManager->getAccessTokenFromAccount($account);

        return Http::withToken($token)
            ->get('https://api.hubapi.com/crm/v3/objects/deals?properties=dealname,amount,pipeline,dealstage&limit=100')
            ->json();
    }

    /**
     * Get pipelines.
     */
    public function getPipelines(HubspotAccount $account, HubSpotTokenManager $tokenManager): array
    {
        $token = $tokenManager->getAccessTokenFromAccount($account);

        return Http::withToken($token)
            ->get('https://api.hubapi.com/crm/v3/pipelines/deals')
            ->json();
    }

    /**
     * Get companies.
     */
    public function getCompanies(HubspotAccount $account, HubSpotTokenManager $tokenManager): array
    {
        $token = $tokenManager->getAccessTokenFromAccount($account);

        return Http::withToken($token)
            ->get('https://api.hubapi.com/crm/v3/objects/companies?properties=name,domain&limit=100')
            ->json();
    }

    /**
     * Create a new deal.
     */
    public function createDeal(int $userId, HubSpotTokenManager $tokenManager, array $data): array
    {
        $token = $tokenManager->getAccessToken($userId);

        $response = Http::withToken($token)
            ->post('https://api.hubapi.com/crm/v3/objects/deals', [
                'properties' => $data,
            ]);

        if ($response->failed()) {
            Log::error('Error creating deal', ['body' => $response->body()]);
            throw new \Exception('Error creating deal: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Update an existing deal.
     */
    public function updateDeal(int $userId, HubSpotTokenManager $tokenManager, string $dealId, array $data): array
    {
        $token = $tokenManager->getAccessToken($userId);

        $response = Http::withToken($token)
            ->patch("https://api.hubapi.com/crm/v3/objects/deals/{$dealId}", [
                'properties' => $data,
            ]);

        if ($response->failed()) {
            Log::error('Error updating deal', ['body' => $response->body()]);
            throw new \Exception('Error updating deal: ' . $response->body());
        }

        return $response->json();
    }

     /**
     * Create a new contact in HubSpot.
     */
    public function createContact(HubspotAccount $account, HubSpotTokenManager $tokenManager, array $data)
    {
        try {
            $accessToken = $tokenManager->getAccessTokenFromAccount($account);

            // Create contact on HubSpot
            $response = Http::withToken($accessToken)
                ->post('https://api.hubapi.com/crm/v3/objects/contacts', [
                    'properties' => [
                        'email' => $data['email'] ?? null,
                        'firstname' => $data['firstname'] ?? null,
                        'lastname' => $data['lastname'] ?? null,
                        'phone' => $data['phone'] ?? null,
                    ],
                ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Hubspot contact creation failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
