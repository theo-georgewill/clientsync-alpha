<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            [
                'hubspot_account_id' => 1,
                'object_type' => 'contact',
                'event_type' => 'contact_created',
                'object_id' => '12345',
                'title' => 'Contact Created',
                'description' => 'Jane Doe was added to the CRM.',
                'occurred_at' => Carbon::parse('2025-06-19 10:30:00'),
                'details' => json_encode(['name' => 'Jane Doe']),
            ],
            [
                'hubspot_account_id' => 1,
                'object_type' => 'deal',
                'event_type' => 'deal_moved',
                'object_id' => '67890',
                'title' => 'Deal Moved',
                'description' => 'CRM Integration deal moved from Proposal to Negotiation.',
                'occurred_at' => Carbon::parse('2025-06-18 15:15:00'),
                'details' => json_encode(['from_stage' => 'Proposal', 'to_stage' => 'Negotiation']),
            ],
            [
                'hubspot_account_id' => 1,
                'object_type' => 'note',
                'event_type' => 'note_added',
                'object_id' => '98765',
                'title' => 'Note Added',
                'description' => 'Follow-up call scheduled with John Smith.',
                'occurred_at' => Carbon::parse('2025-06-18 11:00:00'),
                'details' => json_encode(['subject' => 'Follow-up call']),
            ],
            [
                'hubspot_account_id' => 1,
                'object_type' => 'integration',
                'event_type' => 'integration_synced',
                'object_id' => null,
                'title' => 'Integration Synced',
                'description' => 'HubSpot sync completed successfully.',
                'occurred_at' => Carbon::parse('2025-06-17 09:00:00'),
                'details' => json_encode(['status' => 'success']),
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}
