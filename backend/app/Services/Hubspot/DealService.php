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

            $pipelineId = $props['pipeline'] ?? null;
            $stageId = $props['dealstage'] ?? null;

            $pipeline = $pipelineId
                ? Pipeline::where('label_key', $pipelineId)->first()
                : null;

            $stage = $stageId
                ? Stage::where('label_key', $stageId)->first()
                : null;

            Deal::updateOrCreate(
                ['deal_id' => $item['id']],
                [
                    'dealname'     => $props['dealname'] ?? null,
                    'amount'       => $props['amount'] ?? null,

                    'pipeline_id'  => $pipelineId,
                    'pipeline'     => $pipeline?->label ?? null,

                    'stage_id'     => $stageId,
                    'stage'        => $stage?->label ?? null,
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
