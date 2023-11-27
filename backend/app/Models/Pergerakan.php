<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pergerakan extends Model
{
    protected $table = 'pergerakan';
    protected $primaryKey = 'id_pergerakan';
    // public $incrementing = true;
    protected $fillable = [
        'id_proker',
        'id_kak',
        'nama_pergerakan',
        'deskripsi_pergerakan',
    ];

    // Tambahkan properti-properitas atau metode-metode tambahan sesuai kebutuhan

    // Contoh metode untuk mengambil data pergerakan berdasarkan id_pergerakan
    public function scopeByProker($query, $id_pergerakan)
    {
        return $query->where('id_pergerakan', $id_pergerakan);
    }

    public function proker(){
        return $this->belongsTo(Proker::class, 'id_proker');
    }
}
