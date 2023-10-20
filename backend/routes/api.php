<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicEventController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// KALENDER AKADEMIK

// Mengambil semua data kegiatan akademik
Route::get('academic-events', [AcademicEventController::class, 'index']);

// Mengambil data kegiatan akademik berdasarkan ID
Route::get('academic-events/{id}', [AcademicEventController::class, 'show']);

// Menyimpan data kegiatan akademik baru
Route::post('academic-events', [AcademicEventController::class, 'store']);

// Memperbarui data kegiatan akademik berdasarkan ID
Route::put('academic-events/{id}', [AcademicEventController::class, 'update']);

// Menghapus data kegiatan akademik berdasarkan ID
Route::delete('academic-events/{id}', [AcademicEventController::class, 'destroy']);

// PENGUMUMAN

// Mengambil semua data Pengumuman
Route::get('pengumuman', 'PengumumanController@index');

// Mengambil data Pengumuman berdasarkan ID
Route::get('pengumuman/{id}', 'PengumumanController@show');

// Menyimpan data Pengumuman baru ke Database
Route::post('pengumuman', 'PengumumanController@store');

// Memperbarui data Pengumuman berdasarkan ID
Route::put('pengumuman/{id}', 'PengumumanController@update');

// Menghapus data Pengumuman berdasarkan ID
Route::delete('pengumuman/{id}', 'PengumumanController@destroy');


// PERGERAKAN

// Mengambil semua data Pergerakan dari Database
Route::get('pergerakan', 'PergerakanController@index');

// Mengambil data Pergerakan dari Database berdasarkan ID
Route::get('pergerakan/{id}', 'PergerakanController@show');

// Menyimpan data Pergerakan ke Database
Route::post('pergerakan', 'PergerakanController@store');

// Memperbarui data Pergerakan berdasarkan ID
Route::put('pergerakan/{id}', 'PergerakanController@update');

// Menghapus data pergerakan berdasarkan ID
Route::delete('pergerakan/{id}', 'PergerakanController@destroy');