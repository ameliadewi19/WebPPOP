<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengumuman;

class PengumumanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }

    public function index()
    {
        $pengumuman = Pengumuman::all();
        return response()->json($pengumuman);
    }

    public function show($id)
    {
        $pengumuman = Pengumuman::find($id);
        
        if (!$pengumuman) {
            return response()->json(['message' => 'Pengumuman not found'], 404);
        }

        return response()->json($pengumuman);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'slug' => 'required|unique:pengumuman',
            'judul_konten' => 'required',
            'isi_konten' => 'required',
            'tanggal' => 'date',
        ]);

        $pengumuman = new Pengumuman;
        $pengumuman->slug = $request->slug;
        $pengumuman->judul_konten = $request->judul_konten;
        $pengumuman->isi_konten = $request->isi_konten;
        $pengumuman->gambar = $request->gambar;
        $pengumuman->tanggal = $request->tanggal;
        $pengumuman->save();

        return response()->json($pengumuman, 201);
    }

    public function update(Request $request, $id)
    {
        // Find the Pengumuman model instance by ID
        $pengumuman = Pengumuman::find($id);

        // Check if the Pengumuman with the given ID exists
        if (!$pengumuman) {
            return response()->json(['message' => 'Pengumuman not found'], 404);
        }

        // Validate the incoming request data
        $this->validate($request, [
            'slug' => 'required|unique:pengumuman,slug,' . $id . ',id_pengumuman',
            'judul_konten' => 'required',
            'isi_konten' => 'required',
            'tanggal' => 'date',
        ]);

        // Prepare the data for update
        $updateData = [
            'slug' => $request->slug,
            'judul_konten' => $request->judul_konten,
            'isi_konten' => $request->isi_konten,
            'gambar' => $request->gambar,
            'tanggal' => $request->tanggal,
        ];

        // Use the update method to update the model
        $pengumuman->update($updateData);

        // Return a response indicating success
        return response()->json(['message' => 'Pengumuman updated successfully', 'data' => $pengumuman]);
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::find($id);
        
        if (!$pengumuman) {
            return response()->json(['message' => 'Pengumuman not found'], 404);
        }

        $pengumuman->delete();
        return response()->json(['message' => 'Pengumuman deleted'], 200);
    }
}
