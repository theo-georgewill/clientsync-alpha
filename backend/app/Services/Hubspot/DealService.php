<?php

namespace App\Services\HubSpot;

use App\Models\Deal;
use App\Models\Pipeline;
use App\Models\Stage;

class DealService
{
    protected HubSpotService $hubSpot;

    public function __construct(HubSpotService $hubSpot)
    {
        $this->hubSpot = $hubSpot;
    }

    /**
     * Sync deals from HubSpot.
     *
     * @param int $userId
     * @param HubSpotTokenManager $tokenManager
     * @return bool
     */
    public function sync(int $userId, HubSpotTokenManager $tokenManager): bool
    {
        $response = $this->hubSpot->getDeals($userId, $tokenManager);

        if (!isset($response['results'])) {
            logger()->error('Deal sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $item) {
            $props = $item['properties'] ?? [];

            $pipeline = !empty($props['pipeline'])
                ? Pipeline::where('label_key', $props['pipeline'])->first()
                : null;

            $stage = !empty($props['dealstage'])
                ? Stage::where('label_key', $props['dealstage'])->first()
                : null;

            Deal::updateOrCreate(
                ['hubspot_id' => $item['id']],
                [
                    'dealname' => $props['dealname'] ?? null,
                    'pipeline_id' => $pipeline?->id,
                    'stage_id' => $stage?->id,
                    'amount' => $props['amount'] ?? null,
                ]
            );
        }

        return true;
    }

    /**
     * Create a new deal in HubSpot.
     *
     * @param int $userId
     * @param HubSpotTokenManager $tokenManager
     * @param array $data
     * @return array
     */
    public function createDeal(int $userId, HubSpotTokenManager $tokenManager, array $data): array
    {
        return $this->hubSpot->createDeal($userId, $tokenManager, $data);
    }

    /**
     * Update an existing deal in HubSpot.
     *
     * @param int $userId
     * @param HubSpotTokenManager $tokenManager
     * @param string $dealId
     * @param array $data
     * @return array
     */
    public function updateDeal(int $userId, HubSpotTokenManager $tokenManager, string $dealId, array $data): array
    {
        return $this->hubSpot->updateDeal($userId, $tokenManager, $dealId, $data);
    }
}
