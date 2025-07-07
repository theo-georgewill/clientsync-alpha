<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pipeline extends Model
{
    use HasFactory;

    protected $fillable = [
        'hubspot_account_id',
        'pipeline_id',
        'label',
        'label_key',
    ];

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }
}
