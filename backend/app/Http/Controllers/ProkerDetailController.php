<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use App\Models\KAK;
use App\Models\Ormawa;
use Illuminate\Http\Request;

class ProkerDetailController extends Controller
{
    public function jumlahTiapOrmawa()
    {
        $prokers = Proker::with(['kak.ketua_ormawa' => function ($query) {
            $query->where('tahun_jabatan', '2023/2024');
        }, 'kak.ketua_ormawa.ormawa'])->get();

        $result = [];

        foreach ($prokers as $proker) {
            $ormawa = $proker->kak->ketua_ormawa->ormawa;

            // Inisialisasi total_proker jika belum ada
            if (!isset($result[$ormawa->id_ormawa])) {
                $result[$ormawa->id_ormawa] = [
                    'id_ormawa' => $ormawa->id_ormawa,
                    'nama_ormawa' => $ormawa->nama_ormawa,
                    'total_proker' => 0,
                ];
            }

            // Increment total_proker
            $result[$ormawa->id_ormawa]['total_proker']++;
        }

        // Loop through all ormawas to check for those with 0 prokers
        $ormawas = Ormawa::all();

        foreach ($ormawas as $ormawa) {
            $idOrmawa = $ormawa->id_ormawa;

            // If the ormawa is not in the result array, add it with total_proker = 0
            if (!isset($result[$idOrmawa])) {
                $result[$idOrmawa] = [
                    'id_ormawa' => $idOrmawa,
                    'nama_ormawa' => $ormawa->nama_ormawa,
                    'total_proker' => 0,
                ];
            }
        }

        // Ubah array menjadi indexed array
        $result = array_values($result);

        return response()->json($result, 200);
    }
}
