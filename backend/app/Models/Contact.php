<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'hubspot_account_id',
        'contact_id',
        'email',
        'firstname',
        'lastname',
        'phone',
    ];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }
}
