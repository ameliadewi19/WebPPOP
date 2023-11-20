<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timeline;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TimelineController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }
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
        try {
            $this->validate($request, [
                'nama_kegiatan' => 'required',
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date',
                // 'izin_submit' => 'required',
            ]);

            $timeline = new Timeline;
            $timeline->nama_kegiatan = $request->nama_kegiatan;
            $timeline->tanggal_mulai = $request->tanggal_mulai;
            $timeline->tanggal_selesai = $request->tanggal_selesai;
            $timeline->izin_submit = "true";
            $timeline->save();

            return response()->json($timeline, 201);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->validator->errors()], 400);
        } catch (QueryException $e) {
            // Handle database query errors
            return response()->json(['error' => 'Failed to save data to the database.'], 500);
        } catch (ModelNotFoundException $e) {
            // Handle model not found errors
            return response()->json(['error' => 'Model not found.'], 404);
        } catch (\Exception $e) {
            // Catch any other exceptions
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
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
            'tanggal_selesai' => 'required|date',
            // 'izin_submit' => 'required',
        ]);
        $timeline->nama_kegiatan = $request->nama_kegiatan;
        $timeline->tanggal_mulai = $request->tanggal_mulai;
        $timeline->tanggal_selesai = $request->tanggal_selesai;
        // $timeline->izin_submit = $request->izin_submit;
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
