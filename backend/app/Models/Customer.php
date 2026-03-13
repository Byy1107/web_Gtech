<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
   protected $fillable = [
    'name',
    'phone',
    'address',
    'odp_id',
    'package_id',
    'latitude',
    'longitude',
    'ppp_secret',
    'status'
];
protected $casts = [
    'latitude' => 'float',
    'longitude' => 'float',
];
}
