<?php

namespace App\Http\Controllers;

use App\Models\Odp;
use Illuminate\Http\Request;

class OdpController extends Controller
{
    public function index()
    {
        $odps = Odp::withCount('customers')->get();
        
        return response()->json([
            'data' => $odps
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'used_ports' => 'nullable|integer|min:0'
        ]);

        $odp = Odp::create($validated);
        
        return response()->json([
            'data' => $odp->loadCount('customers')
        ], 201);
    }

    public function show($id)
    {
        $odp = Odp::withCount('customers')->findOrFail($id);
        
        return response()->json([
            'data' => $odp
        ]);
    }

    public function update(Request $request, $id)
    {
        $odp = Odp::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
            'used_ports' => 'nullable|integer|min:0'
        ]);

        $odp->update($validated);
        
        return response()->json([
            'data' => $odp->loadCount('customers')
        ]);
    }

    public function destroy($id)
    {
        Odp::destroy($id);

        return response()->json([
            "message" => "ODP deleted successfully"
        ]);
    }
}