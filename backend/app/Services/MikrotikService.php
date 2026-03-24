<?php

namespace App\Services;

use RouterOS\Client;
use RouterOS\Query;

class MikrotikService
{

    protected $client;

    public function __construct()
    {

        try{

            $this->client = new Client([
                "host" => config("mikrotik.host"),
                "user" => config("mikrotik.user"),
                "pass" => config("mikrotik.password"),
                "port" => config("mikrotik.port")
            ]);

        }catch(\Exception $e){

            $this->client = null;

        }

    }

    public function getSecrets()
    {

        if(!$this->client) return [];

        $query = new Query("/ppp/secret/print");

        return $this->client->query($query)->read();

    }

    public function getActive()
{
    $query = new \RouterOS\Query('/ppp/active/print');

    $result = $this->client->query($query)->read();

    return $result;
}

    public function disconnect($username)
    {

        if(!$this->client) return false;

        $query = (new Query("/ppp/active/print"))
            ->where("name",$username);

        $active = $this->client->query($query)->read();

        if(empty($active)) return false;

        $id = $active[0][".id"];

        $remove = (new Query("/ppp/active/remove"))
            ->equal(".id",$id);

        $this->client->query($remove)->read();

        return true;

    }

}