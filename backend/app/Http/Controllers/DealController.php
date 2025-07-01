<?php

namespace App\Http\Controllers;

use App\Services\HubSpot\DealService;
use Illuminate\Http\Request;
use App\Models\Deal;

class DealController extends Controller
{
    protected DealService $dealService;

    public function __construct(DealService $dealService)
    {
        $this->dealService = $dealService;
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
        $stage = \App\Models\Stage::findOrFail($request->stage_id);

        // Update on HubSpot
        $this->dealService->updateDeal($deal->hubspot_id, [
            'dealstage' => $stage->label_key,
        ], $hubspotAccount->access_token);

        // Update locally
        $deal->stage_id = $stage->id;
        $deal->save();

        return response()->json(['deal' => $deal->fresh(['pipeline', 'stage'])]);
    }


}
