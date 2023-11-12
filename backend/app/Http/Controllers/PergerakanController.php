<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pergerakan;

class PergerakanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    public function index()
    {
        $pergerakan = Pergerakan::all();

        if ($pergerakan->isEmpty()) {
            return response()->json(['message' => 'No KAKs found'], 404);
        }

        return response()->json($pergerakan);
    }

    public function show($id)
    {
        $pergerakan = Pergerakan::find($id);

        if (!$pergerakan) {
            return response()->json(['message' => 'Pergerakan not found'], 404);
        }

        return response()->json($pergerakan);
    }

    public function store(Request $request)
    {
        $pergerakan = Pergerakan::create($request->all());
        return response()->json($pergerakan, 201);
    }

    public function update(Request $request, $id)
    {
        $pergerakan = Pergerakan::find($id);

        if (!$pergerakan) {
            return response()->json(['message' => 'Pergerakan not found'], 404);
        }

        $this->validate($request, [
            'deskripsi_kegiatan' => 'required',
            'nama_pergerakan' => 'required',
        ]);

        $pergerakan->nama_pergerakan = $request->nama_pergerakan;
        $pergerakan->deskripsi_pergerakan = $request->deskripsi_pergerakan;
        $pergerakan->save();

        return response()->json($pergerakan);
    }

    public function destroy($id)
    {
        $pergerakan = Pergerakan::find($id);

        if (!$pergerakan) {
            return response()->json(['message' => 'Pergerakan not found'], 404);
        }

        $pergerakan->delete();
        return response()->json(['message' => 'Pergerakan deleted'], 200);
    }
}
