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
    ];
    protected $casts = [
        'scopes' => 'array',
        'expires_at' => 'datetime',
    ];

    protected $dates = ['expires_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
