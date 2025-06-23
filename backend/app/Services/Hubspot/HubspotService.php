<?php

namespace App\Services\Hubspot;

use Illuminate\Support\Facades\Http;

class HubSpotService
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

    public function getAuthUrl(): string
    {
        $query = http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => 'oauth crm.objects.contacts.read crm.objects.contacts.write',
            'response_type' => 'code',
        ]);

        return "https://app.hubspot.com/oauth/authorize?$query";
    }

    public function fetchAccessToken(string $code): array
    {
        $response = Http::asForm()->post('https://api.hubapi.com/oauth/v1/token', [
            'grant_type' => 'authorization_code',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'code' => $code,
        ]);

        return $response->json();
    }

    //to get the hubspot user data
    public function getTokenInfo(string $accessToken): array
    {
        $response = Http::withToken($accessToken)
            ->get('https://api.hubapi.com/oauth/v1/access-tokens/' . $accessToken);

        return $response->json();
    }


    public function refreshAccessToken(string $refreshToken): array
    {
        $response = Http::asForm()->post('https://api.hubapi.com/oauth/v1/token', [
            'grant_type' => 'refresh_token',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $refreshToken,
        ]);

        return $response->json();
    }

    public function getContacts(string $accessToken): array
    {
        $response = Http::withToken($accessToken)->get('https://api.hubapi.com/crm/v3/objects/contacts');

        return $response->json();
    }


    public function getPipelines(string $accessToken): array
    {
        return Http::withToken($accessToken)
            ->get('https://api.hubapi.com/crm/v3/pipelines/deals')
            ->json();
    }

    public function getDeals(string $accessToken): array
    {
        return Http::withToken($accessToken)
            ->get('https://api.hubapi.com/crm/v3/objects/deals?properties=dealname,amount,pipeline,dealstage&limit=100')
            ->json();
    }

    public function getContactsWithDetails(string $accessToken): array
    {
        return Http::withToken($accessToken)
            ->get('https://api.hubapi.com/crm/v3/objects/contacts?properties=email,firstname,lastname&limit=100')
            ->json();
    }

    public function getCompanies(string $accessToken): array
    {
        return Http::withToken($accessToken)
            ->get('https://api.hubapi.com/crm/v3/objects/companies?properties=name,domain&limit=100')
            ->json();
    }

    public function createDeal(array $data, string $accessToken): array
    {
        $response = Http::withToken($accessToken)
            ->post('https://api.hubapi.com/crm/v3/objects/deals', [
                'properties' => $data,
            ]);

        if ($response->failed()) {
            throw new \Exception('Error creating deal: ' . $response->body());
        }

        return $response->json();
    }

    public function updateDeal(string $dealId, array $data, string $accessToken): array
    {
        $response = Http::withToken($accessToken)
            ->patch("https://api.hubapi.com/crm/v3/objects/deals/{$dealId}", [
                'properties' => $data,
            ]);

        if ($response->failed()) {
            throw new \Exception('Error updating deal: ' . $response->body());
        }

        return $response->json();
    }

}
