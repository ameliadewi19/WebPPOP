<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pergerakan extends Model
{
    protected $table = 'pergerakan';
    protected $primaryKey = 'id_pergerakan';
    protected $fillable = [
        'nama_pergerakan',
        'deskripsi_pergerakan',
    ];
}
