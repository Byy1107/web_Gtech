<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();
        
        return response()->json([
            'data' => $packages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'speed' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'mikrotik_profile' => 'nullable|string|max:100'
        ]);

        $package = Package::create($validated);
        
        return response()->json([
            'data' => $package
        ], 201);
    }

    public function show($id)
    {
        $package = Package::findOrFail($id);
        
        return response()->json([
            'data' => $package
        ]);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'speed' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'mikrotik_profile' => 'nullable|string|max:100'
        ]);

        $package->update($validated);
        
        return response()->json([
            'data' => $package
        ]);
    }

    public function destroy($id)
    {
        Package::destroy($id);

        return response()->json([
            "message" => "Package deleted successfully"
        ]);
    }
}