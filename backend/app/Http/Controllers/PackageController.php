<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        return Package::all();
    }

    public function store(Request $request)
    {
        return Package::create($request->all());
    }

    public function show($id)
    {
        return Package::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);
        $package->update($request->all());

        return $package;
    }

    public function destroy($id)
    {
        Package::destroy($id);

        return response()->json([
            "message"=>"Package deleted"
        ]);
    }
}