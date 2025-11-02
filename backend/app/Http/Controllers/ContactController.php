<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\HubspotAccount;
use App\Services\Hubspot\HubspotService;
use App\Services\Hubspot\HubspotTokenManager;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    protected HubspotService $hubspot;
    protected HubspotTokenManager $tokenManager;

    public function __construct(HubspotService $hubspot, HubspotTokenManager $tokenManager)
    {
        $this->hubspot = $hubspot;
        $this->tokenManager = $tokenManager;
    }

    /**
     * Get all contacts (from local DB).
     */
    public function index()
    {
        $contacts = Contact::latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $contacts,
        ]);
    }

    /**
     * Create a new contact in HubSpot and store locally.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:50'
        ]);

        try {
            $user = $request->user();
            $token = $this->tokenManager->getAccessToken($user->id);
            $account = $user->hubspotAccount;

            $data = [
                'email'     => $validated['email'],
                'firstname' => $validated['firstname'],
                'lastname'  => $validated['lastname'],
                'phone'     => $validated['phone'] ?? null,
            ];

            // Create contact in HubSpot
            $response = $this->hubspot->createContact($account, $this->tokenManager, $data);

            // Store locally
            $contact = Contact::create([
                'hubspot_account_id' => $account->id,
                'contact_id' => $response['id'] ?? null,
                'firstname'  => $validated['firstname'],
                'lastname'   => $validated['lastname'],
                'email'      => $validated['email'],
                'phone'      => $validated['phone'] ?? null,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Contact created successfully',
                'data' => [
                    'hubspot' => $response,
                    'local'   => $contact,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('HubSpot contact creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create contact',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
