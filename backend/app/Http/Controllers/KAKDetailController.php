<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KAK;
use App\Models\Proker;
use App\Models\KetuaOrmawa;
use App\Models\Ormawa;

class KAKDetailController extends Controller
{
    public function jumlah()
    {
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

        // Kembalikan respons dengan jumlah KAK yang sesuai
        return response()->json(['count_sudah' => $count_sudah, 'count_belum' => $count_belum], 200);
    }

}
