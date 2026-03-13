<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // LIST customers (pagination + search)
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $query->where('name','like','%'.$request->search.'%')
                  ->orWhere('phone','like','%'.$request->search.'%')
                  ->orWhere('ppp_secret','like','%'.$request->search.'%');
        }

        return $query->latest()->paginate(10);
    }

    // CREATE customer
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'ppp_secret' => 'nullable|string|max:100',
            'status' => 'in:active,suspended,terminated'
        ]);

        return Customer::create($validated);
    }

    // SHOW single customer
    public function show($id)
    {
        return Customer::findOrFail($id);
    }

    // UPDATE customer
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->update($request->all());

        return $customer;
    }

    // DELETE customer
    public function destroy($id)
    {
        Customer::destroy($id);

        return response()->json([
            "message" => "Customer deleted"
        ]);
    }
}