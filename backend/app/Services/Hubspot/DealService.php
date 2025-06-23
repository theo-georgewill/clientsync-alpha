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

    public function sync(string $accessToken): bool
    {
        $response = $this->hubSpot->getDeals($accessToken);

        if (!isset($response['results'])) {
            logger()->error('Deal sync failed', ['response' => $response]);
            return false;
        }

        foreach ($response['results'] as $item) {
            $props = $item['properties'];

            $pipeline = Pipeline::where('label_key', $props['pipeline'] ?? null)->first();
            $stage = Stage::where('label_key', $props['dealstage'] ?? null)->first();

            Deal::updateOrCreate(
                ['hubspot_id' => $item['id']],
                [
                    'dealname' => $props['dealname'] ?? null,
                    'amount' => $props['amount'] ?? null,
                    'pipeline_id' => $pipeline?->id,
                    'stage_id' => $stage?->id,
                ]
            );
        }

        return true;
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
