<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'hubspot_account_id',
        'deal_id',
        'dealname',
        'pipeline_id',
        'pipeline_label',
        'stage_id',
        'stage_label',
        'amount',
    ];

    public function pipeline()
    {
        return $this->belongsTo(Pipeline::class);
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function contacts()
    {
        return $this->belongsToMany(Contact::class);
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class);
    }
}
