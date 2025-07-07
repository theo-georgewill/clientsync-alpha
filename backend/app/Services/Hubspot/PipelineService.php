<?php

namespace App\Services\HubSpot;

use App\Models\Pipeline;
use App\Models\Stage;

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
    public function sync(int $userId, HubSpotTokenManager $tokenManager): bool
    {
        $response = $this->hubSpot->getPipelines($userId, $tokenManager);

        if (!isset($response['results'])) {
            logger()->error('Pipeline sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $pipe) {
            $pipeline = Pipeline::updateOrCreate(
                ['pipeline_id' => $pipe['id']],
                [
                    'label' => $pipe['label'],
                    'label_key' => $pipe['labelKey'] ?? null, // Avoid undefined index
                ]
            );

            foreach ($pipe['stages'] as $stage) {
                $pipeline->stages()->updateOrCreate(
                    ['stage_id' => $stage['id']],
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
