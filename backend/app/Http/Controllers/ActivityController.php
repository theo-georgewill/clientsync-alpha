<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $hubspotAccount = $user->hubspotAccount;

        if (!$hubspotAccount) {
            Log::warning('No HubSpot account found for user', ['user_id' => $user->id]);
            return response()->json(['message' => 'No HubSpot account found'], 404);
        }

        $activities = Activity::where('hubspot_account_id', $hubspotAccount->id)
            ->orderBy('occurred_at', 'desc')
            ->paginate(20);

        return response()->json($activities);
    }

     public function store(Request $request)
    {
        $activity = Activity::create([
            'hubspot_account_id' => $request->hubspot_account_id,
            'event_type' => $request->event_type,
            'title' => $request->title,
            'description' => $request->description,
            'object_type' => $request->object_type,
            'object_id' => $request->object_id,
            'occurred_at' => $request->occurred_at ?? now(),
            'details' => $request->details ?? null,
        ]);

        return response()->json($activity, 201);
    }
}
