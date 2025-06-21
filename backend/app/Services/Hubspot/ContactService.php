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

    public function sync(string $accessToken): bool
    {
        $response = $this->hubSpot->getContactsWithDetails($accessToken);

        if (!isset($response['results'])) {
            logger()->error('Contact sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $item) {
            $props = $item['properties'];

            Contact::updateOrCreate(
                ['hubspot_id' => $item['id']],
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
