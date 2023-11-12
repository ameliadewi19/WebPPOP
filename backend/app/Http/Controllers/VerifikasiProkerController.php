<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use Illuminate\Http\Request;

class VerifikasiProkerController extends Controller
{
    /**
     * Create a new VerifikasiProkerController instance.
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
            $prokerId = $request->input('id_proker');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
    
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Acc tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Acc tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Acc tahap akhir', 'catatan' => $catatan]);
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
            $prokerId = $request->input('id_proker');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
    
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Revisi tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Revisi tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Revisi tahap akhir', 'catatan' => $catatan]);
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
            $prokerId = $request->input('id_proker');
            $catatan = $request->input('catatan');
            $tahap = $request->input('tahap');
            // Lakukan sesuatu dengan data yang diterima, misalnya simpan ke database
            // Contoh:
            if ($tahap == "1"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Tolak tahap 1', 'catatan' => $catatan]);
            } else if ($tahap == "2"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Tolak tahap 2', 'catatan' => $catatan]);
            } else if ($tahap == "3"){
                Proker::where('id_proker', $prokerId)->update(['status' => 'Tolak tahap akhir', 'catatan' => $catatan]);
            }
    
            return response()->json(['message' => 'Tolak berhasil disubmit'], 200);
        } catch (\Exception $e) {
            // Tangani kesalahan
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}
