<?php

namespace App\Services;

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
            'scope' => 'oauth contacts workflows crm.objects.contacts.read crm.objects.contacts.write',
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

    // Add more wrappers as needed (e.g. create contact, get workflows)
}
