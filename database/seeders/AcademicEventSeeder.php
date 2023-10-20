<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicEvent;

class AcademicEventSeeder extends Seeder
{
    public function run()
    {
        // Contoh data kegiatan akademik
        $events = [
            [
                'tanggal_mulai' => '2023-10-25',
                'tanggal_akhir' => '2023-10-28',
                'nama_kegiatan' => 'Ujian Midterm',
            ],
            [
                'tanggal_mulai' => '2023-11-15',
                'tanggal_akhir' => '2023-11-20',
                'nama_kegiatan' => 'Pendaftaran Semester Baru',
            ],
        ];

        // Memasukkan data kegiatan ke database
        foreach ($events as $event) {
            AcademicEvent::create($event);
        }
    }
}
