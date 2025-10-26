<?php

namespace App\Http\Controllers;

use App\Services\HubSpot\DealService;
use Illuminate\Http\Request;
use App\Models\Deal;
use \App\Models\Stage;
use App\Services\Hubspot\HubSpotTokenManager;
use Illuminate\Support\Facades\Log;



class DealController extends Controller
{
    protected DealService $dealService;
    protected HubSpotTokenManager $tokenManager;

    public function __construct(DealService $dealService, HubSpotTokenManager $tokenManager)
    {
        $this->dealService = $dealService;
        $this->tokenManager = $tokenManager;
    }

    public function store(Request $request)
    {
        $request->validate([
            'dealname' => 'required|string',
            'amount' => 'nullable|numeric',
            'pipeline' => 'required|string',
            'dealstage' => 'required|string',
        ]);

        $user = $request->user();
        $hubspotAccount = $user->hubspotAccount;

        $data = $request->only(['dealname', 'amount', 'pipeline', 'dealstage']);
        $deal = $this->dealService->createDeal($data, $hubspotAccount->access_token);

        // (Optional) store in local DB
        // Deal::create([...]);

        return response()->json(['deal' => $deal]);
    }

    public function index(Request $request)
    {
        return Deal::with(['pipeline', 'stage'])->get();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'stage_id' => 'required|exists:stages,id',
        ]);

        $deal = Deal::findOrFail($id);
        $user = $request->user();
        $hubspotAccount = $user->hubspotAccount;
        $stage = Stage::findOrFail($request->stage_id);

        // Update locally
        $deal->stage_id = $stage->stage_id;
        $deal->save();

       // Only attempt HubSpot update if we have a hubspot_id and an access token
        if (!empty($hubspotAccount->hubspot_user_id) && !empty($hubspotAccount->access_token)) {
            try {
                // userId, tokenManager, dealId, updateData
                $this->dealService->updateDeal($user->id, $this->tokenManager, $deal->deal_id, [
                    'dealstage' => $stage->stage_id,
                ]);
                Log::info('DealService update successful for deal '.$deal->deal_id);
            } catch (\TypeError $e) {
                // Defensive: log and continue so API doesn't 500 for type mismatches
                Log::error('DealService updateDeal TypeError: '.$e->getMessage());
            } catch (\Throwable $e) {
                Log::error('DealService update failed: '.$e->getMessage().$hubspotAccount->hubspot_user_id.' and '.$hubspotAccount->access_token);
            }
        } else {
            Log::warning('Skipping HubSpot update for deal '.$stage->label_key.' — missing hubspot_id or access token. hubspot account id: '.$hubspotAccount->hubspot_user_id.' and hubspot access token:'.$hubspotAccount->access_token);
        }

        return response()->json(['deal' => $deal->fresh(['pipeline', 'stage'])]);
    }


}
