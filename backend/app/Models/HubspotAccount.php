<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HubspotAccount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'access_token',
        'refresh_token',
        'expires_at',
        'hubspot_user_id',
        'scopes',
    ];

    protected $casts = [
        'scopes' => 'array',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function isExpired(): bool
    {
        // Add a 5-minute buffer to avoid edge cases
        return now()->greaterThan($this->expires_at->subMinutes(5));
    }
}
