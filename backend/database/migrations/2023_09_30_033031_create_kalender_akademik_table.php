<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKalenderAkademikTable extends Migration
{
    public function up()
    {
        Schema::create('kalender_akademik', function (Blueprint $table) {
            $table->id('id_kegiatan');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('nama_kegiatan');
            $table->string('file_kalender_akademik')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('kalender_akademik');
    }
}
