<?php

namespace App\Http\Controllers;

use App\Services\MikrotikService;

class MikrotikController extends Controller
{
    public function secrets(MikrotikService $mikrotik)
    {
        $data = $mikrotik->getSecrets();

        return response()->json([
            "data" => $data ?? []
        ]);
    }

    public function activeUsers(MikrotikService $mikrotik)
    {
        $active = $mikrotik->getActive();

        $transformed = collect($active ?? [])->map(function ($user) {

            return [
                "name" => $user['name'] ?? 'Unknown',
                "callerId" => $user['caller-id'] ?? 'N/A',
                "uptime" => $user['uptime'] ?? '0s',
                "bytesIn" => (int) ($user['bytes-in'] ?? 0),
                "bytesOut" => (int) ($user['bytes-out'] ?? 0),
                "address" => $user['address'] ?? null
            ];

        });

        return response()->json([
            "data" => $transformed
        ]);
    }

    public function dashboard(MikrotikService $mikrotik)
    {
        $secrets = $mikrotik->getSecrets() ?? [];
        $active = $mikrotik->getActive() ?? [];

        $total = count($secrets);
        $online = count($active);
        $offline = $total - $online;

        return response()->json([
            "data" => [
                "totalCustomers" => $total,
                "onlineCustomers" => $online,
                "offlineCustomers" => $offline,
                "monthlyRevenue" => 2500000,
                "bandwidthUsage" => [
                    "upload" => 1048576,
                    "download" => 10485760
                ],
                "unpaidInvoices" => 12
            ]
        ]);
    }

    public function getTraffic()
    {
        $trafficData = [];

        for ($i = 23; $i >= 0; $i--) {

            $trafficData[] = [
                "time" => now()->subHours($i)->format('H:i'),
                "upload" => rand(500000, 2000000),
                "download" => rand(5000000, 15000000)
            ];
        }

        return response()->json([
            "data" => $trafficData
        ]);
    }

    public function monitoring(MikrotikService $mikrotik)
    {
        $secrets = $mikrotik->getSecrets() ?? [];
        $active = $mikrotik->getActive() ?? [];

        $activeNames = collect($active)->pluck('name')->toArray();

        $result = [];

        foreach ($secrets as $secret) {

            $status = in_array($secret['name'], $activeNames) ? 'online' : 'offline';

            $result[] = [
                "name" => $secret['name'] ?? null,
                "profile" => $secret['profile'] ?? null,
                "service" => $secret['service'] ?? null,
                "status" => $status
            ];
        }

        return response()->json([
            "data" => $result
        ]);
    }

    public function disconnect($username, MikrotikService $mikrotik)
    {
        try {

            $mikrotik->disconnect($username);

            return response()->json([
                "success" => true,
                "message" => "User disconnected"
            ]);

        } catch (\Exception $e) {

            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], 500);

        }
    }
}