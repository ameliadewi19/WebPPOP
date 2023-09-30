<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePergerakanTable extends Migration
{
    public function up()
    {
        Schema::create('pergerakan', function (Blueprint $table) {
            $table->id('id_pergerakan');
            $table->string('id_proker');
            $table->string('nama_pergerakan');
            $table->longText('deskripsi_pergerakan');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pergerakan');
    }
}