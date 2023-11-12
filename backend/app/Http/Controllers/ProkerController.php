<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use App\Models\KAK;
use App\Models\Ormawa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProkerController extends Controller
{
    /**
     * Create a new KAKController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }
    
    // Method for handling HTTP GET requests
    public function index()
    {
        $prokers = Proker::with('kak.ketua_ormawa.ormawa')->get();

        if ($prokers->isEmpty()) {
            return response()->json(['message' => 'No Prokers found'], 404);
        }

        return response()->json($prokers, 200);
    }

    // Method for handling HTTP GET requests to show a single product
    public function show($id)
    {
        $prokers = Proker::with('kak.ketua_ormawa.ormawa')
                 ->where('id', $id) // Menambahkan kondisi where
                 ->get();

        if (!$prokers) {
            return response()->json(['message' => 'Proker not found'], 404);
        }
        
        return response()->json($prokers, 200);
    }

    // Method for handling HTTP POST requests to create a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_proker' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $proker = Proker::create($request->all());
        return response()->json($proker, 201);
    }

    // Method for handling HTTP PUT/PATCH requests to update a product
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_proker' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $proker = Proker::find($id);
        if (!$proker) {
            return response()->json(['message' => 'Proker not found'], 404);
        }
        $proker->update($request->all());
        return response()->json($proker, 201);
    }

    // Method for handling HTTP DELETE requests to delete a product
    public function destroy($id)
    {
        $proker = Proker::find($id);

        if (!$proker) {
            return response()->json(['message' => 'Proker not found'], 404);
        }
        $proker->delete();
        return response()->json(['message' => 'Proker deleted successfully'], 200);
    }

    public function ubahIzinSubmit($id)
    {
        $proker = Proker::find($id);

        if ($proker) {
            // Convert the string value to a boolean and toggle it
            $proker->izin_submit = $proker->izin_submit === 'true' ? 'false' : 'true';

            $proker->save();

            return response()->json(['message' => 'Izin submit updated successfully'], 200);
        } else {
            return response()->json(['message' => 'Proker not found'], 404);
        }
    }
}
