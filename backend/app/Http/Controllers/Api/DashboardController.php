<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
   public function index()
{
    return response()->json([
        "totalCustomers" => 0,
        "onlineCustomers" => 0,
        "offlineCustomers" => 0,
        "monthlyRevenue" => 0,
        "unpaidInvoices" => 0,
        "bandwidthUsage" => [
            "upload" => 0,
            "download" => 0
        ]
    ]);
}
public function traffic()
{
    return response()->json([
        [
            "time" => "10:00",
            "upload" => 1200000,
            "download" => 2400000
        ],
        [
            "time" => "10:05",
            "upload" => 1500000,
            "download" => 2100000
        ],
        [
            "time" => "10:10",
            "upload" => 1300000,
            "download" => 2600000
        ]
    ]);
}
}