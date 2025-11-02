<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\HubspotAccount;
use App\Services\Hubspot\HubspotService;
use App\Services\Hubspot\HubspotTokenManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WebhookController extends Controller
{
    protected HubspotService $hubspot;
    protected HubspotTokenManager $tokenManager;

    public function __construct(HubspotService $hubspot, HubspotTokenManager $tokenManager)
    {
        $this->hubspot = $hubspot;
        $this->tokenManager = $tokenManager;
    }

    public function handleHubspot(Request $request)
    {
        $events = $request->all();

        Log::info('Received HubSpot webhook', ['payload' => $events]);

        foreach ($events as $event) {
            $objectTypeId = $event['objectType'] ?? ($event['objectTypeId'] ?? 'unknown');
            $subscriptionType = $event['subscriptionType'] ?? 'unknown';
            $objectId = $event['objectId'] ?? null;

            // convert milliseconds → seconds
            $occurredAt = isset($event['occurredAt'])
                ? Carbon::createFromTimestampMs($event['occurredAt'])
                : now();

            // Map objectTypeId to name
            $typeMap = [
                '0-1' => 'contact',
                '0-2' => 'company',
                '0-3' => 'deal',
                '0-4' => 'ticket',
                '0-5' => 'product',
            ];

            $objectType = $typeMap[$objectTypeId] ?? 'unknown';

            // Identify user/account (optional if multi-user app)
            $hubspotAccount = HubspotAccount::first(); // Or match by portalId if you store it
            $userId = $hubspotAccount?->user_id;

            $activityData = [
                'hubspot_account_id' => $hubspotAccount?->id,
                'object_type' => $objectType,
                'event_type' => $subscriptionType,
                'object_id' => $objectId,
                'occurred_at' => $occurredAt,
                'details' => $event,
            ];

            // Build human-readable titles & descriptions
            switch ($subscriptionType) {
                case 'object.creation':
                    $activityData['title'] = ucfirst($objectType) . ' Created';
                    $activityData['description'] = "A new {$objectType} was added to HubSpot.";
                    break;

                case 'object.propertyChange':
                case 'contact.propertyChange':
                    $property = $event['propertyName'] ?? 'property';
                    $newValue = $event['propertyValue'] ?? 'updated';
                    $activityData['title'] = ucfirst($objectType) . ' Updated';
                    $activityData['description'] = ucfirst($objectType) . " {$property} changed to {$newValue}.";
                    break;

                case 'object.deletion':
                case 'contact.deletion':
                    $activityData['title'] = ucfirst($objectType) . ' Deleted';
                    $activityData['description'] = "A {$objectType} was deleted from HubSpot.";
                    break;

                default:
                    $activityData['title'] = ucfirst($objectType) . ' Event';
                    $activityData['description'] = "A {$objectType} event occurred in HubSpot.";
                    break;
            }

            Activity::create($activityData);
        }

        return response()->json(['status' => 'ok']);
    }
}
