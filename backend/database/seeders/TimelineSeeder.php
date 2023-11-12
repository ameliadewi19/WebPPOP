<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Timeline;

class TimelineSeeder extends Seeder
{
    public function run()
    {
        // Data timeline yang ingin Anda masukkan ke database
        $data = [
            [
                'nama_kegiatan' => 'Kegiatan Pertama',
                'tanggal_mulai' => '2023-10-20',
                'tanggal_selesai' => '2023-10-25',
                'izin_submit' => 'false'
            ],
            [
                'id_kegiatan' => '2',
                'nama_kegiatan' => 'Kegiatan 2',
                'tanggal_mulai' => '2023-11-05',
                'tanggal_selesai' => '2023-11-10',
                'izin_submit' => 'false'
            ],
            // Tambahkan data timeline lainnya sesuai kebutuhan Anda
        ];

        // Masukkan data ke dalam tabel 'timeline'
        foreach ($data as $item) {
            Timeline::create([
                'id_kegiatan' => $item['id_kegiatan'],
                'nama_kegiatan' => $item['nama_kegiatan'],
                'tanggal_mulai' => $item['tanggal_mulai'],
                'tanggal_selesai' => $item['tanggal_selesai'],
                'izin_submit' => $item['izin_submit'],
            ]);
        }
    }
}
