<?php

namespace App\Http\Controllers;

use App\Models\Odp;
use Illuminate\Http\Request;

class OdpController extends Controller
{
    public function index()
    {
        return Odp::all();
    }

    public function store(Request $request)
    {
        return Odp::create($request->all());
    }

    public function show($id)
    {
        return Odp::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $odp = Odp::findOrFail($id);
        $odp->update($request->all());

        return $odp;
    }

    public function destroy($id)
    {
        Odp::destroy($id);

        return response()->json([
            "message"=>"ODP deleted"
        ]);
    }
}