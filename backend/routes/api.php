<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicEventController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PergerakanController;
use App\Http\Controllers\TimelineController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\OrmawaController;
use App\Http\Controllers\KAKController;
use App\Http\Controllers\KAKDetailController;
use App\Http\Controllers\ProkerController;
use App\Http\Controllers\LPJController;
use App\Http\Controllers\KetuaOrmawaController;
use App\Http\Controllers\VerifikasiKAKController;
use App\Http\Controllers\VerifikasiProkerController;
use App\Http\Controllers\VerifikasiLPJController;
use Illuminate\Support\Facades\Auth;

use App\Http\Middleware\CheckRole;

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

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/get-ketua/{id}', [AuthController::class, 'getKetuaOrmawa']);     
});

// KETUA ORMAWA

Route::group([
    'middleware' => 'api',
    'prefix' => 'ketua-ormawa'
], function () {
    Route::get('/', [KetuaOrmawaController::class, 'index']);
    Route::get('/{id}', [KetuaOrmawaController::class, 'show']);
    Route::post('/', [KetuaOrmawaController::class, 'store']);
    Route::put('/{id}', [KetuaOrmawaController::class, 'update']);
    Route::delete('/{id}', [KetuaOrmawaController::class, 'destroy']);
    Route::get('/user/{id}', [KetuaOrmawaController::class, 'getUser']);
});

// KALENDER AKADEMIK

Route::group([
    'middleware' => 'api',
    'prefix' => 'academic-events'
], function () {
    Route::get('/', [AcademicEventController::class, 'index']);
    Route::get('/{id}', [AcademicEventController::class, 'show']);
    Route::post('/', [AcademicEventController::class, 'store']);
    Route::put('/{id}', [AcademicEventController::class, 'update']);
    Route::delete('/{id}', [AcademicEventController::class, 'destroy']);
});

// PENGUMUMAN

Route::group([
    'middleware' => 'api',
    'prefix' => 'pengumuman'
], function () {
    Route::get('/', [PengumumanController::class, 'index']);
    Route::get('/{id}', [PengumumanController::class, 'show']);
    Route::post('/', [PengumumanController::class, 'store']);
    Route::put('/{id}', [PengumumanController::class, 'update']);
    Route::delete('/{id}', [PengumumanController::class, 'destroy']);
});

// PERGERAKAN

Route::group([
    'middleware' => 'api',
    'prefix' => 'pergerakan'
], function () {
    Route::get('/', [PergerakanController::class, 'index']);
    Route::get('/{id}', [PergerakanController::class, 'show']);
    Route::post('/', [PergerakanController::class, 'store']);
    Route::put('/{id}', [PergerakanController::class, 'update']);
    Route::delete('/{id}', [PergerakanController::class, 'destroy']);
});

Route::get('/test', [TestController::class, 'test']);
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// API routes for Ormawa
Route::get('/ormawa', [OrmawaController::class, 'index']);
Route::get('/ormawa/{id}', [OrmawaController::class, 'show']);
Route::post('/ormawa', [OrmawaController::class, 'store']);
Route::put('/ormawa/{id}', [OrmawaController::class, 'update']);
Route::delete('/ormawa/{id}', [OrmawaController::class, 'destroy']);

// API routes for KAK
Route::group([
    'middleware' => 'api',
    'prefix' => 'kak'
], function () {
    Route::get('/', [KAKController::class, 'index']);
    Route::get('/{id}', [KAKController::class, 'show']);
    Route::post('/', [KAKController::class, 'store']);
    Route::put('/{id}', [KAKController::class, 'update']);
    Route::delete('/{id}', [KAKController::class, 'destroy']);
    Route::get('/file/{filename}', [KAKController::class, 'getFile']);
    Route::get('/jumlah', [KAKController::class, 'jumlah']);
});

// API routes for verifikasi KAK
Route::group([
    'middleware' => 'api',
    'prefix' => 'kak/verifikasi'
], function () {
    Route::post('/acc', [VerifikasiKAKController::class, 'acc']);
    Route::post('/revisi', [VerifikasiKAKController::class, 'revisi']);
    Route::post('/tolak', [VerifikasiKAKController::class, 'tolak']);
});

// API routes for KAK
Route::group([
    'middleware' => 'api',
    'prefix' => 'kak/detail'
], function () {
    Route::get('/jumlah', [KAKDetailController::class, 'jumlah']);
});

// API routes for Proker
Route::group([
    'middleware' => 'api',
    'prefix' => 'proker'
], function () {
    Route::get('/', [ProkerController::class, 'index']);
    Route::get('/{id}', [ProkerController::class, 'show']);
    Route::post('/', [ProkerController::class, 'store']);
    Route::put('/{id}', [ProkerController::class, 'update']);
    Route::delete('/{id}', [ProkerController::class, 'destroy']);
    Route::put('/izin-submit/{id}', [ProkerController::class, 'ubahIzinSubmit']);
});

// API routes for verifikasi Proker
Route::group([
    'middleware' => 'api',
    'prefix' => 'proker/verifikasi'
], function () {
    Route::post('/acc', [VerifikasiProkerController::class, 'acc']);
    Route::post('/revisi', [VerifikasiProkerController::class, 'revisi']);
    Route::post('/tolak', [VerifikasiProkerController::class, 'tolak']);
});

// API routes for LPJ
Route::group([
    'middleware' => 'api',
    'prefix' => 'lpj'
], function () {
    Route::get('/', [LPJController::class, 'index']);
    Route::get('/{id}', [LPJController::class, 'show']);
    Route::post('/', [LPJController::class, 'store']);
    Route::put('/{id}', [LPJController::class, 'update']);
    Route::delete('/{id}', [LPJController::class, 'destroy']);
    Route::delete('pergerakan/{id}', [PergerakanController::class,'destroy']);
});

// API routes for verifikasi Proker
Route::group([
    'middleware' => 'api',
    'prefix' => 'lpj/verifikasi'
], function () {
    Route::post('/acc', [VerifikasiLPJController::class, 'acc']);
    Route::post('/revisi', [VerifikasiLPJController::class, 'revisi']);
    Route::post('/tolak', [VerifikasiLPJController::class, 'tolak']);
});

// TIMELINE

Route::group([
    'middleware' => 'api',
    'prefix' => 'timeline'
], function () {
    Route::get('/', [TimelineController::class, 'index']);
    Route::get('/{id}', [TimelineController::class, 'show']);
    Route::post('/', [TimelineController::class, 'store']);
    Route::put('/{id}', [TimelineController::class, 'update']);
    Route::delete('/{id}', [TimelineController::class, 'destroy']);
});
