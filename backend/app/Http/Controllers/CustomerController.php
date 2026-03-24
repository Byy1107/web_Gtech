<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::with(['package', 'odp']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%')
                  ->orWhere('pppoe_username', 'like', '%' . $request->search . '%');
        }

        $customers = $query->latest()->paginate(10);
        
        return response()->json([
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pppoe_username' => 'required|string|max:100|unique:customers',
            'phone' => 'nullable|string|max:50',
            'package_id' => 'nullable|exists:packages,id',
            'odp_id' => 'nullable|exists:odps,id',
            'status' => 'in:active,suspended,terminated'
        ]);

        $customer = Customer::create($validated);
        
        return response()->json([
            'data' => $customer->load(['package', 'odp'])
        ], 201);
    }

    public function show($id)
    {
        $customer = Customer::with(['package', 'odp'])->findOrFail($id);
        
        return response()->json([
            'data' => $customer
        ]);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'pppoe_username' => 'sometimes|required|string|max:100|unique:customers,pppoe_username,' . $id,
            'phone' => 'nullable|string|max:50',
            'package_id' => 'nullable|exists:packages,id',
            'odp_id' => 'nullable|exists:odps,id',
            'status' => 'in:active,suspended,terminated'
        ]);

        $customer->update($validated);
        
        return response()->json([
            'data' => $customer->load(['package', 'odp'])
        ]);
    }

    public function destroy($id)
    {
        Customer::destroy($id);

        return response()->json([
            "message" => "Customer deleted successfully"
        ]);
    }
}