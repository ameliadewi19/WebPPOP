<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LPJ extends Model
{
    protected $table = 'lpj';
    protected $primaryKey = 'id_lpj';
    protected $fillable = [
        'id_proker', 
        'file_lpj',
        'status',
        'catatan',
        'file_lpj'
    ];
    public $incrementing = true;
    public $timestamps = true;

    public function proker(){
        return $this->belongsTo(Proker::class, 'id_proker');
    }
}
