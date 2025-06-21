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

    public function sync(string $accessToken): bool
    {
        $response = $this->hubSpot->getPipelines($accessToken);

        if (!isset($response['results'])) {
            logger()->error('Pipeline sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $pipe) {
            $pipeline = Pipeline::updateOrCreate(
                ['hubspot_id' => $pipe['id']],
                [
                    'label' => $pipe['label'],
                    'label_key' => $pipe['labelKey'],
                ]
            );

            foreach ($pipe['stages'] as $stage) {
                $pipeline->stages()->updateOrCreate(
                    ['hubspot_id' => $stage['id']],
                    [
                        'label' => $stage['label'],
                        'label_key' => $stage['labelKey'],
                        'display_order' => $stage['displayOrder'] ?? 0,
                    ]
                );
            }
        }

        return true;
    }
}

