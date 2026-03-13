<?php

namespace App\Http\Controllers;

use App\Services\MikrotikService;

class MikrotikController extends Controller
{
    public function secrets(MikrotikService $mikrotik)
    {
        return $mikrotik->getSecrets();
    }

    public function active(MikrotikService $mikrotik)
    {
        return $mikrotik->getActive();
    }
    public function dashboard(MikrotikService $mikrotik)
{
    $secrets = $mikrotik->getSecrets();
    $active = $mikrotik->getActive();

    $total = count($secrets);
    $online = count($active);
    $offline = $total - $online;

    return response()->json([
        "total_customers" => $total,
        "online" => $online,
        "offline" => $offline
    ]);
}
public function monitoring(MikrotikService $mikrotik)
{
    $secrets = $mikrotik->getSecrets();
    $active = $mikrotik->getActive();

    $activeNames = collect($active)->pluck('name')->toArray();

    $result = [];

    foreach ($secrets as $secret) {

        $status = in_array($secret['name'], $activeNames) ? 'online' : 'offline';

        $result[] = [
            "name" => $secret['name'],
            "profile" => $secret['profile'] ?? null,
            "service" => $secret['service'] ?? null,
            "status" => $status
        ];
    }

    return response()->json($result);
}
public function disconnect($username, MikrotikService $mikrotik)
{
    return $mikrotik->disconnectUser($username);
}
public function activeUsers(MikrotikService $mikrotik)
{
    return $mikrotik->getActive();
}
}