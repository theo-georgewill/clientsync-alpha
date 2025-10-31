<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\Hubspot\HubspotService;
use App\Models\User;
use App\Models\HubspotAccount;
use App\Services\Hubspot\PipelineService;
use App\Services\Hubspot\DealService;
use App\Services\Hubspot\ContactService;
use App\Services\Hubspot\CompanyService;
use App\Services\Hubspot\HubspotTokenManager;

class HubspotController extends Controller
{
    protected HubspotService $hubspot;

    public function __construct(HubspotService $hubspot)
    {
        $this->hubspot = $hubspot;
    }

    /**
     * Step 1: Return HubSpot OAuth URL to frontend
     */
    public function getAuthUrl()
    {
        return response()->json([
            'url' => $this->hubspot->getAuthUrl()
        ]);
    }

    /**
     * Step 2: Handle HubSpot OAuth callback from frontend
     * Frontend should POST the `code` here after receiving it
     */

    public function handleCallback(Request $request)
    {
        $user = $request->user();
        $code = $request->input('code');

        if (!$code) {
            return response()->json(['error' => 'Missing code'], 400);
        }

        $tokens = $this->hubspot->fetchAccessToken($code);
        $tokenInfo = $this->hubspot->getTokenInfo($tokens['access_token']);

        $hubspotUserId = $tokenInfo['hub_id'] ?? null;
        if (!$hubspotUserId) {
            return response()->json(['error' => 'HubSpot user ID missing'], 400);
        }

        // Include trashed (soft-deleted) records in search
        $existingAccount = HubspotAccount::withTrashed()
            ->where('hubspot_user_id', $hubspotUserId)
            ->first();

        if ($existingAccount) {
            // If soft-deleted, restore it
            if ($existingAccount->trashed()) {
                $existingAccount->restore();
            }

            // Update tokens and scopes
            $existingAccount->update([
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at' => now()->addSeconds($tokens['expires_in']),
                'scopes' => implode(' ', $tokenInfo['scopes'] ?? []),
                'user_id' => $user->id, // optionally update user relation
            ]);
        } else {
            // Create new record
            $user->hubspotAccount()->create([
                'hubspot_user_id' => $hubspotUserId,
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at' => now()->addSeconds($tokens['expires_in']),
                'scopes' => implode(' ', $tokenInfo['scopes'] ?? []),
            ]);
        }

        return response()->json(['message' => 'HubSpot Connected']);
    }


    public function status()
    {
        $user = auth()->user();
        $account = $user->hubspotAccount;

        if (!$account) {
            return response()->json(['connected' => false]);
        }

        return response()->json([
            'connected' => true,
            'last_synced' => $account->updated_at->toDateTimeString(),
        ]);
    }

    //disconnect hubspot account
    public function disconnect()
    {
        $user = auth()->user();

        $hubspotAccount = $user->hubspotAccount;

        if ($hubspotAccount) {
            $hubspotAccount->delete(); // soft delete
        }

        return response()->json(['message' => 'HubSpot disconnected successfully.']);
    }


     /**
     * Sync all HubSpot data
     */
    public function sync(
        PipelineService $pipelineService,
        DealService $dealService,
        ContactService $contactService,
        CompanyService $companyService,
        HubSpotTokenManager $tokenManager
    ) {
        $user = auth()->user();
        $account = $user->hubspotAccount;

        if (!$account) {
            return response()->json(['error' => 'No connected HubSpot account'], 400);
        }

        $pipelineService->sync($account, $tokenManager);
        $dealService->sync($account, $tokenManager);
        $contactService->sync($account, $tokenManager);
        $companyService->sync($account, $tokenManager);

        return response()->json(['message' => 'HubSpot data synced successfully']);
    }


}
