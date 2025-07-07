<?php

namespace App\Services\HubSpot;

use App\Models\Pipeline;
use App\Models\Stage;
use App\Models\HubspotAccount;

class PipelineService
{
    protected HubSpotService $hubSpot;

    public function __construct(HubSpotService $hubSpot)
    {
        $this->hubSpot = $hubSpot;
    }

    /**
     * Sync all pipelines and stages from HubSpot for the given user.
     */
    public function sync(HubspotAccount $account, HubSpotTokenManager $tokenManager): bool
    {
        $response = $this->hubSpot->getPipelines($account, $tokenManager);

        if (!isset($response['results'])) {
            logger()->error('Pipeline sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $pipe) {
            $pipeline = Pipeline::updateOrCreate(
                [
                    'hubspot_account_id' => $account->id,
                    'pipeline_id' => $pipe['id'],
                ],
                [
                    'label' => $pipe['label'],
                    'label_key' => $pipe['labelKey'] ?? null, // Avoid undefined index
                ]
            );

            foreach ($pipe['stages'] as $stage) {
                $pipeline->stages()->updateOrCreate(
                    [
                        'hubspot_account_id' => $account->id,
                        'stage_id' => $stage['id']
                    ],
                    [
                        'label' => $stage['label'],
                        'label_key' => $stage['labelKey'] ?? null, // Avoid undefined index
                        'display_order' => $stage['displayOrder'] ?? 0,
                    ]
                );
            }
        }

        return true;
    }
}
