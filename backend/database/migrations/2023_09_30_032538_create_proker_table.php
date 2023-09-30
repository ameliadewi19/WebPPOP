<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proker', function (Blueprint $table) {
            $table->id('id_proker');
            $table->bigInteger('id_kak');
            $table->string('nama_kegiatan');
            $table->longText('deskripsi_kegiatan');
            $table->date('tanggal_mulai');
            $table->date('tanggal_akhir');
            $table->string('status');
            $table->longText('catatan');
            $table->string('file_proposal');
            $table->string('file_rab');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proker');
    }
};
