<?php

namespace App\Http\Controllers;

use App\Models\LPJ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class LPJController extends Controller
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
        $tahunSaatIni = date('Y');
        $tahunJabatan = $tahunSaatIni . '/' . ($tahunSaatIni + 1);

        $lpjs = LPJ::with('proker.kak.ketua_ormawa.ormawa')
            ->whereHas('proker.kak.ketua_ormawa', function ($query) use ($tahunJabatan) {
                $query->where('tahun_jabatan', $tahunJabatan);
            })->get();

        if ($lpjs->isEmpty()) {
            return response()->json(['message' => 'LPJ not found'], 404);
        }
        
        return response()->json($lpjs, 200);
    }

    // Method for handling HTTP GET requests to show a single product
    public function show($id)
    {
        $lpjs = LPJ::with('proker.kak.ketua_ormawa.ormawa')->where('id_proker', $id)->get();

        if (!$lpjs) {
            return response()->json(['message' => 'LPJ not found'], 404);
        }

        return response()->json($lpjs, 200);
    }

    // Method for handling HTTP POST requests to create a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_proker' => 'required',
            'file_lpj' => 'required|file',
            'file_rab_lpj' => 'required|file',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $id_proker = $request->input('id_proker');

        // Simpan file LPJ
        if ($request->hasFile('file_lpj')) {
            $fileLPJ = $request->file('file_lpj');
            $fileNameLPJ  = $id_proker . '_' . $fileLPJ->getClientOriginalName();
            $fileLPJ->move(public_path('uploads/lpj'), $fileNameLPJ);
        }

        // Simpan file RAB LPJ
        if ($request->hasFile('file_rab_lpj')) {
            $fileRAB = $request->file('file_rab_lpj');
            $fileNameRAB  = $id_proker . '_' . $fileRAB->getClientOriginalName();
            $fileRAB->move(public_path('uploads/lpj'), $fileNameRAB);
        }

        $lpj = LPJ::create([
            'id_proker' => $id_proker,
            'file_lpj' => $fileNameLPJ,
            'file_rab_lpj' => $fileNameRAB,
            'status' => $request->input('status'),
            'catatan' => $request->input('catatan'),
        ]);
        return response()->json($lpj, 201);
    }

    // Method for handling HTTP PUT/PATCH requests to update a product
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'file_lpj' => 'file',
            'file_rab_lpj' => 'file',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $lpj = LPJ::where('id_proker', $id)->first();

        if (!$lpj) {
            return response()->json(['message' => 'LPJ not found'], 404);
        }

        // Simpan file LPJ
        if ($request->hasFile('file_lpj')) {
            $fileLPJ = $request->file('file_lpj');
            $fileNameLPJ  = $id . '_' . $fileLPJ->getClientOriginalName();
            $filePathLPJ = public_path('uploads/lpj') . '/' . $fileNameLPJ;

            // Hapus file lama jika sudah ada
            if (file_exists($filePathLPJ)) {
                unlink($filePathLPJ);
            }

            $fileLPJ->move(public_path('uploads/lpj'), $fileNameLPJ);
            $lpj->file_lpj = $fileNameLPJ;
        }

        // Simpan file RAB LPJ
        if ($request->hasFile('file_rab_lpj')) {
            $fileRAB = $request->file('file_rab_lpj');
            $fileNameRAB  = $id . '_' . $fileRAB->getClientOriginalName();
            $filePathRAB = public_path('uploads/lpj') . '/' . $fileNameRAB;

            // Hapus file lama jika sudah ada
            if (file_exists($filePathRAB)) {
                unlink($filePathRAB);
            }

            $fileRAB->move(public_path('uploads/lpj'), $fileNameRAB);
            $lpj->file_rab_lpj = $fileNameRAB;
        }

        $lpj->update($request->except(['id_proker','file_lpj', 'file_rab_lpj'])); // Update other fields

        return response()->json($lpj, 201);
    }


    // Method for handling HTTP DELETE requests to delete a product
    public function destroy($id)
    {
        $lpj = LPJ::find($id);
        if (!$lpj) {
            return response()->json(['message' => 'LPJ not found'], 404);
        }
        $lpj->delete();
        return response()->json(['message' => 'LPJ deleted successfully'], 200);
    }

    public function getFile($filename)
    {
        $path = public_path('uploads/lpj/'. $filename);

        if (!File::exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // $file = File::get($path);
        // $type = File::mimeType($path);

        // $response = response()->make($file, 200);
        // $response->header('Content-Type', $type);

        return response()->file($path, ['Content-Type' => 'application/pdf']);
    }
}
