<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrmawaController;
use App\Http\Controllers\KAKController;
use App\Http\Controllers\ProkerController;
use App\Http\Controllers\LPJController;
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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// API routes for Ormawa
Route::get('/ormawa', [OrmawaController::class, 'index']);
Route::get('/ormawa/{id}', [OrmawaController::class, 'show']);
Route::post('/ormawa', [OrmawaController::class, 'store']);
Route::put('/ormawa/{id}', [OrmawaController::class, 'update']);
Route::delete('/ormawa/{id}', [OrmawaController::class, 'destroy']);

// API routes for Kak
Route::get('/kak', [KAKController::class, 'index']);
Route::get('/kak/{id}', [KAKController::class, 'show']);
Route::post('/kak', [KAKController::class, 'store']);
Route::put('/kak/{id}', [KAKController::class, 'update']);
Route::delete('/kak/{id}', [KAKController::class, 'destroy']);

//API routes for Proker
Route::get('/proker', [ProkerController::class, 'index']);
Route::get('/proker/{id}', [ProkerController::class, 'show']);
Route::post('/proker', [ProkerController::class, 'store']);
Route::put('/proker/{id}', [ProkerController::class, 'update']);
Route::delete('/proker/{id}', [ProkerController::class, 'destroy']);

//API routes for LPJ
Route::get('/lpj', [LPJController::class, 'index']);
Route::get('/lpj/{id}', [LPJController::class, 'show']);
Route::post('/lpj', [LPJController::class, 'store']);
Route::put('/lpj/{id}', [LPJController::class, 'update']);
Route::delete('/lpj/{id}', [LPJController::class, 'destroy']);