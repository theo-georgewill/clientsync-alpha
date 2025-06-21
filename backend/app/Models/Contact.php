<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'hubspot_id',
        'email',
        'firstname',
        'lastname',
    ];

    public function deals()
    {
        return $this->belongsToMany(Deal::class);
    }
}
