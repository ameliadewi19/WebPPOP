<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicEventController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PergerakanController;
use App\Http\Controllers\TimelineController;


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
Route::get('pengumuman', [PengumumanController::class, 'index']);

// Mengambil data Pengumuman berdasarkan ID
Route::get('pengumuman/{id}', [PengumumanController::class, 'show']);

// Menyimpan data Pengumuman baru ke Database
Route::post('pengumuman', [PengumumanController::class, 'store']);

// Memperbarui data Pengumuman berdasarkan ID
Route::put('pengumuman/{id}', [PengumumanController::class, 'update']);

// Menghapus data Pengumuman berdasarkan ID
Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy']);


// PERGERAKAN

// Mengambil semua data Pergerakan dari Database
Route::get('pergerakan', [PergerakanController::class,'index']);

// Mengambil data Pergerakan dari Database berdasarkan ID
Route::get('pergerakan/{id}', [PergerakanController::class,'show']);

// Menyimpan data Pergerakan ke Database
Route::post('pergerakan', [PergerakanController::class,'store']);

// Memperbarui data Pergerakan berdasarkan ID
Route::put('pergerakan/{id}', [PergerakanController::class,'update']);

// Menghapus data pergerakan berdasarkan ID
Route::delete('pergerakan/{id}', [PergerakanController::class,'destroy']);

// TIMELINE

Route::get('timeline', [TimelineController::class,'index']);
Route::get('timeline/{id}', [TimelineController::class,'show']);
Route::post('timeline', [TimelineController::class,'store']);
Route::put('timeline/{id}', [TimelineController::class,'update']);
Route::delete('timeline/{id}', [TimelineController::class,'destroy']);