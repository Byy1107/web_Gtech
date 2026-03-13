<?php

namespace App\Services;

use RouterOS\Client;
use RouterOS\Query;
use App\Models\MikrotikSetting;

class MikrotikService
{
    protected $client;

    public function __construct()
    {
        $setting = MikrotikSetting::first();

        $this->client = new Client([
            'host' => $setting->host,
            'user' => $setting->username,
            'pass' => $setting->password,
            'port' => $setting->port ?? 8728,
        ]);
    }

    public function getSecrets()
    {
        $query = new Query('/ppp/secret/print');

        return $this->client->query($query)->read();
    }

    public function getActive()
    {
        $query = new Query('/ppp/active/print');

        return $this->client->query($query)->read();
    }
    public function disconnectUser($username)
{
    $query = new Query('/ppp/active/remove');
    $query->equal('numbers', $username);

    return $this->client->query($query)->read();
}
public function getTraffic()
{
    $query = new Query('/interface/monitor-traffic');
    $query->equal('interface', 'ether1');
    $query->equal('once');

    return $this->client->query($query)->read();
}
}