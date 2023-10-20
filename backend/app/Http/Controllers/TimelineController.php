<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timeline;

class TimelineController extends Controller
{
    public function index()
    {
        $timeline = Timeline::all();
        return response()->json($timeline);
    }

    public function show($id)
    {
        $timeline = Timeline::find($id);

        if (!$timeline) {
            return response()->json(['message' => 'Timeline not found'], 404);
        }

        return response()->json($timeline);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nama_kegiatan' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_akhir' => 'required|date',
        ]);

        $timeline = new Timeline;
        $timeline->nama_kegiatan = $request->nama_kegiatan;
        $timeline->tanggal_mulai = $request->tanggal_mulai;
        $timeline->tanggal_akhir = $request->tanggal_akhir;
        $timeline->save();

        return response()->json($timeline, 201);
    }

    public function update(Request $request, $id)
    {
        $timeline = Timeline::find($id);

        if (!$timeline) {
            return response()->json(['message' => 'Timeline not found'], 404);
        }

        $this->validate($request, [
            'nama_kegiatan' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_akhir' => 'required|date',
        ]);

        $timeline->nama_kegiatan = $request->nama_kegiatan;
        $timeline->tanggal_mulai = $request->tanggal_mulai;
        $timeline->tanggal_akhir = $request->tanggal_akhir;
        $timeline->save();

        return response()->json($timeline);
    }

    public function destroy($id)
    {
        $timeline = Timeline::find($id);

        if (!$timeline) {
            return response()->json(['message' => 'Timeline not found'], 404);
        }

        $timeline->delete();
        return response()->json(['message' => 'Timeline deleted'], 200);
    }
}
