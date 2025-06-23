<?php

namespace App\Http\Controllers;

use App\Services\HubSpot\DealService;
use Illuminate\Http\Request;

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
}
