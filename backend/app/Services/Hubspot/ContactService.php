<?php

namespace App\Services\HubSpot;

use App\Models\Contact;

class ContactService
{
    protected HubSpotService $hubSpot;

    public function __construct(HubSpotService $hubSpot)
    {
        $this->hubSpot = $hubSpot;
    }

    /**
     * Sync contacts from HubSpot.
     *
     * @param int $userId
     * @param HubSpotTokenManager $tokenManager
     * @return bool
     */
    public function sync(int $userId, HubSpotTokenManager $tokenManager): bool
    {
        $response = $this->hubSpot->getContactsWithDetails($userId, $tokenManager);

        if (!isset($response['results'])) {
            logger()->error('Contact sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $item) {
            $props = $item['properties'] ?? [];

            Contact::updateOrCreate(
                ['contact_id' => $item['id']],
                [
                    'email' => $props['email'] ?? null,
                    'firstname' => $props['firstname'] ?? null,
                    'lastname' => $props['lastname'] ?? null,
                ]
            );
        }

        return true;
    }
}
