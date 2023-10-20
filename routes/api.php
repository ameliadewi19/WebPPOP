<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\dummyAPI;
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

Route::get("data", [dummyAPI::class,"getData"]);

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