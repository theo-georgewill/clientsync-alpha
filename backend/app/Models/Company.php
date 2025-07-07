<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'hubspot_account_id',
        'company_id',
        'name',
        'domain',
    ];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }
}
