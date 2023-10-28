<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProkerController extends Controller
{
    // Method for handling HTTP GET requests
    public function index()
    {
        $prokers = Proker::all();
        return response()->json($prokers, 200);
    }

    // Method for handling HTTP GET requests to show a single product
    public function show($id)
    {
        $prokers = Proker::find();
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
}
