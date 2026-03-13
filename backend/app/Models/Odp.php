<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Odp extends Model
{
    protected $fillable = [
    'name',
    'location',
    'capacity',
    'latitude',
    'longitude'
];
}
