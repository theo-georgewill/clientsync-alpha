<?php

namespace App\Services\Hubspot;

use App\Models\Company;
use App\Models\HubspotAccount;

class CompanyService
{
    protected HubSpotService $hubSpot;

    public function __construct(HubSpotService $hubSpot)
    {
        $this->hubSpot = $hubSpot;
    }

    public function sync(HubspotAccount $account, HubSpotTokenManager $tokenManager): bool
    {
        // Get a fresh token (refreshing if expired)
        $token = $tokenManager->getAccessTokenFromAccount($account);

        $response = $this->hubSpot->getCompanies($account, $tokenManager);

        if (!isset($response['results'])) {
            logger()->error('Company sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $item) {
            $props = $item['properties'] ?? [];

            Company::updateOrCreate(
                ['company_id' => $item['id']],
                [
                    'name' => $props['name'] ?? null,
                    'domain' => $props['domain'] ?? null,
                ]
            );
        }

        return true;
    }
}
