<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timeline extends Model
{
    protected $table = 'timeline'; // Nama tabel database yang sesuai

    protected $fillable = [
        'nama_kegiatan',
        'tanggal_mulai',
        'tanggal_akhir',
    ];

    // Tambahkan properti-properitas atau metode-metode tambahan sesuai kebutuhan

    // Contoh metode untuk mengambil data timeline berdasarkan tanggal mulai
    public function scopeByTanggalMulai($query, $tanggalMulai)
    {
        return $query->where('tanggal_mulai', $tanggalMulai);
    }
}
