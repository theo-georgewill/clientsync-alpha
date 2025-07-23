<?php

namespace App\Http\Controllers;

use App\Services\HubSpot\DealService;
use App\Services\HubSpot\HubSpotTokenManager;
use Illuminate\Http\Request;
use App\Models\Deal;
use App\Models\Stage;

class DealController extends Controller
{
    protected DealService $dealService;
    protected HubSpotTokenManager $tokenManager;

    public function __construct(DealService $dealService, HubspotTokenManager $tokenManager)
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
            'stage_id' => 'required|string', // label key
        ]);

        $deal = Deal::findOrFail($id);
        $user = $request->user();
        $hubspotAccount = $user->hubspotAccount;

        // Find new stage to get label
        $stage = Stage::where('stage_id', $request->stage_id)->firstOrFail();

        // ✅ Update on HubSpot
        $this->dealService->updateDeal($hubspotAccount, $this->tokenManager, $deal->deal_id, [
            'stage_label' => $stage->label_key,
        ]);

        // ✅ Update locally
        $deal->stage_id = $stage->stage_id;
        $deal->stage_label = $stage->label;
        $deal->save();

        return response()->json(['deal' => $deal->fresh()]);
    }


}
