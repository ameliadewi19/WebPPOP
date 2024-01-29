<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KAK;
use App\Models\Proker;
use App\Models\KetuaOrmawa;
use App\Models\Ormawa;

class KAKDetailController extends Controller
{
    public function jumlah(Request $request)
    {
        $jenis = $request->input('jenis');

        // Dapatkan tahun saat ini
        $tahunSaatIni = date('Y');
        // Hitung tahun jabatan untuk tahun berikutnya
        $tahunJabatan = $tahunSaatIni . '/' . ($tahunSaatIni + 1);

        // Ambil KAK dengan menghubungkan relasi
        $kaks = KAK::with('ketua_ormawa')->get();

        // Filter KAK yang memiliki Ketua ORMAWA dengan tahun_jabatan yang sesuai
        $filteredKaks = $kaks->filter(function ($kak) use ($tahunJabatan) {
            return optional($kak->ketua_ormawa)->tahun_jabatan === $tahunJabatan;
        });

        // Hitung jumlah KAK yang sesuai
        $count_sudah = $filteredKaks->count();

        // Dapatkan jumlah ORMAWA
        $totalOrmawa = Ormawa::count();

        $count_belum = $totalOrmawa - $count_sudah;

        $count_review = 0;

        if ($jenis == "1") {
            // You can perform the count operation here if needed.
            $count_review = KAK::where(function ($query) {
                    $query->where('status', 'Diajukan');
                        //   ->orWhere('status', 'Revisi tahap 1')
                        //   ->orWhere('status', 'Tolak tahap 1');
                })
                ->count();
        } else if ($jenis == "2") {
            // You can perform the count operation here if needed.
            $count_review = KAK::where(function ($query) {
                    $query->where('status', 'Acc tahap 1')
                          ->orWhere('status', 'Revisi tahap 2')
                          ->orWhere('status', 'Tolak tahap 2');
                })
                ->count();
        } else if ($jenis == "3") {
            // You can perform the count operation here if needed.
            $count_review = KAK::where(function ($query) {
                    $query->where('status', 'Acc tahap 2')
                          ->orWhere('status', 'Revisi tahap 3')
                          ->orWhere('status', 'Tolak tahap 3');
                })
                ->count();
        } else if ($jenis == "3") {
            // You can perform the count operation here if needed.
            $count_review = KAK::where(function ($query) {
                    $query->where('status', 'Acc tahap 3')
                          ->orWhere('status', 'Revisi tahap akhir')
                          ->orWhere('status', 'Tolak tahap akhir');
                })
                ->count();
        }


        // Kembalikan respons dengan jumlah KAK yang sesuai
        return response()->json(['count_sudah' => $count_sudah, 'count_belum' => $count_belum, 'count_review' => $count_review], 200);
    }

    public function ormawa(Request $request)
    {
        $id_ketua = $request->input('id');
        $tahunSaatIni = date('Y');
        $tahunJabatan = $tahunSaatIni . '/' . ($tahunSaatIni + 1);

        $kak = KAK::whereHas('ketua_ormawa', function ($query) use ($id_ketua, $tahunJabatan) {
            $query->where('tahun_jabatan', $tahunJabatan)
                ->where('id_ketua', $id_ketua);
        })->withCount('prokers')->first();

        $kakExists = KAK::whereHas('ketua_ormawa', function ($query) use ($id_ketua, $tahunJabatan) {
            $query->where('tahun_jabatan', $tahunJabatan)
                  ->where('id_ketua', $id_ketua);
        })->exists();

        // Check if $kak is null and set default values accordingly
        if ($kak) {
            $count_proker = $kak->prokers_count;
        } else {
            $count_proker = 0;
        }

        if ($kakExists) {
            $status = $kak->status;
        } else {
            $status = "Belum Unggah";
        }

        return response()->json(['status' => $status, 'count_proker' => $count_proker], 200);        
    }


}
