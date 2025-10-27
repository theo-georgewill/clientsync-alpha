<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'hubspot_account_id',
        'object_type',      // e.g. contact, deal, company, note
        'event_type',       // e.g. created, updated, moved_stage
        'object_id',        // HubSpot object ID
        'title',            // e.g. "Deal Moved"
        'description',      // e.g. "CRM Integration deal moved from Proposal to Negotiation."
        'occurred_at',
        'details',          // JSON data for context
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'details' => 'array',
    ];

    // Relationships
    public function hubspotAccount()
    {
        return $this->belongsTo(HubspotAccount::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
