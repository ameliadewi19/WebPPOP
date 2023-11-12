<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pergerakan extends Model
{
    protected $table = 'pergerakan'; // Nama tabel database yang sesuai
    protected $primaryKey = 'id_pergerakan';
    protected $fillable = [
        'deskripsi_kegiatan',
        'nama_pergerakan',
    ];

    // Tambahkan properti-properitas atau metode-metode tambahan sesuai kebutuhan

    // Contoh metode untuk mengambil data pergerakan berdasarkan id_pergerakan
    public function scopeByProker($query, $id_pergerakan)
    {
        return $query->where('id_pergerakan', $id_pergerakan);
    }
}
