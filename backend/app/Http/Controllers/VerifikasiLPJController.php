<?php

namespace App\Http\Controllers;

use App\Models\LPJ;
use Illuminate\Http\Request;

class VerifikasiLPJController extends Controller
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

    public function acc(Request $request)
    {
        try {
            $lpjID = $request->input('id_lpj');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
    
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Acc tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Acc tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Acc tahap 3', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Acc tahap akhir', 'catatan' => $catatan]);
            }
    
            return response()->json(['message' => 'Acc berhasil disubmit'], 200);
        } catch (\Exception $e) {
            // Tangani kesalahan
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function revisi(Request $request)
    {
        try {
            $lpjID = $request->input('id_lpj');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
    
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Revisi tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Revisi tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Revisi tahap 3', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Revisi tahap akhir', 'catatan' => $catatan]);
            }
    
            return response()->json(['message' => 'Revisi berhasil disubmit'], 200);
        } catch (\Exception $e) {
            // Tangani kesalahan
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function tolak(Request $request)
    {
        try {
            $lpjID = $request->input('id_lpj');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Tolak tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Tolak tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Tolak tahap 3', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                LPJ::where('id_lpj', $lpjID)->update(['status' => 'Tolak tahap akhir', 'catatan' => $catatan]);
            }
    
            return response()->json(['message' => 'Tolak berhasil disubmit'], 200);
        } catch (\Exception $e) {
            // Tangani kesalahan
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}
