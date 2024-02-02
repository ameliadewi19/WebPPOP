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
use App\Http\Controllers\ProkerDetailController;
use App\Http\Controllers\LPJController;
use App\Http\Controllers\KetuaOrmawaController;
use App\Http\Controllers\VerifikasiKAKController;
use App\Http\Controllers\VerifikasiProkerController;
use App\Http\Controllers\VerifikasiLPJController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\SarprasController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\DetailPeminjamanController;

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
    Route::get('/user-profile/{id}', [AuthController::class, 'userData']);
    Route::get('/get-data-ketua/{id}', [AuthController::class, 'getDataKetuaOrmawa']); 
    Route::get('/get-ketua/{id}', [AuthController::class, 'getKetuaOrmawa']);
    Route::get('/get-ketua', [AuthController::class, 'getAllOrmawaUsers']); 
    Route::get('/users', [AuthController::class, 'getAllUsers']); 
    Route::delete('/users/{id}', [AuthController::class, 'deleteAccount']);
    Route::put('/users/{id}', [AuthController::class, 'editAccount']);
    Route::put('/ubah-profil/{id}', [AuthController::class, 'editProfil']);
    Route::put('/ubah-password/{id}', [AuthController::class, 'ubahPassword']);
    Route::put('/ubah-password-admin/{id}', [AuthController::class, 'ubahPasswordAdmin']);
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
    Route::get('/user_id/{id}', [KetuaOrmawaController::class, 'getByUserId']);
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
Route::group([
    'middleware' => 'api',
    'prefix' => 'ormawa'
], function () {
    Route::get('/', [OrmawaController::class, 'index']);
    Route::get('/{id}', [OrmawaController::class, 'show']);
    Route::post('/', [OrmawaController::class, 'store']);
    Route::put('/{id}', [OrmawaController::class, 'update']);
    Route::delete('/{id}', [OrmawaController::class, 'destroy']);
});

// API routes for KAK
Route::group([
    'middleware' => 'api',
    'prefix' => 'kak'
], function () {
    Route::get('/', [KAKController::class, 'index']);
    Route::get('/{id}', [KAKController::class, 'show']);
    Route::post('/', [KAKController::class, 'store']);
    Route::post('/{id}', [KAKController::class, 'update']);
    Route::delete('/{id}', [KAKController::class, 'destroy']);
    Route::get('/file/{filename}', [KAKController::class, 'getFile']);
    Route::get('/jumlah', [KAKController::class, 'jumlah']);
    Route::get('/kakbyketua/{id}', [KAKController::class, 'getByIdKetua']);
    Route::get('/ketua/{id}', [KAKController::class, 'getByKetuaId']);
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
    Route::post('/jumlah', [KAKDetailController::class, 'jumlah']);
    Route::post('/ormawa', [KAKDetailController::class, 'ormawa']);
});

// API routes for Proker
Route::group([
    'middleware' => 'api',
    'prefix' => 'proker'
], function () {
    Route::get('/', [ProkerController::class, 'index']);
    Route::get('/{id}', [ProkerController::class, 'show']);
    Route::post('/', [ProkerController::class, 'store']);
    Route::post('/{id}', [ProkerController::class, 'update']);
    Route::delete('/{id}', [ProkerController::class, 'destroy']);
    Route::get('/file/{filename}', [ProkerController::class, 'getFile']);
    Route::put('/izin-submit/{id}', [ProkerController::class, 'ubahIzinSubmit']);
    Route::get('/getProker', [ProkerController::class, 'getTotalProkerTiapOrmawa']);
    Route::get('/kak/{id}', [ProkerController::class, 'getByKakId']);
});

// Detail proker
Route::group([
    'middleware' => 'api',
    'prefix' => 'proker/detail'
], function () {
    Route::get('/jumlahTiapOrmawa', [ProkerDetailController::class, 'jumlahTiapOrmawa']);
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
    Route::get('/proker/{idProker}', [LPJController::class, 'getByProkerId']);
    Route::post('/', [LPJController::class, 'store']);
    Route::post('/{id}', [LPJController::class, 'update']);
    Route::delete('/{id}', [LPJController::class, 'destroy']);
    Route::delete('pergerakan/{id}', [PergerakanController::class,'destroy']);
    Route::get('/file/{filename}', [LPJController::class, 'getFile']);
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

// SARPRAS
Route::group([
    'middleware' => 'api',
    'prefix' => 'sarpras'
], function () {
    Route::get('/', [SarprasController::class, 'index']); 
    Route::get('/{id}', [SarprasController::class, 'show']);
    Route::post('/', [SarprasController::class, 'store']); 
    Route::patch('/{id}', [SarprasController::class, 'update']); 
    Route::delete('/{id}', [SarprasController::class, 'destroy']); 
    Route::get('/tersedia/show', [SarprasController::class, 'getAvailable']); 
});

// INVENTARIS
Route::group([
    'middleware' => 'api',
    'prefix' => 'inventaris'
], function () {
    Route::get('/', [InventarisController::class, 'index']); 
    Route::get('/{id}', [InventarisController::class, 'show']);
    Route::post('/{id}', [InventarisController::class, 'store']); 
    Route::patch('/{id}', [InventarisController::class, 'update']); 
    Route::delete('/{id}', [InventarisController::class, 'destroy']); 
    Route::get('/sarpras/{id}', [InventarisController::class, 'getBySarpras']);
});

// PEMINJAMAN
Route::group([
    'middleware' => 'api',
    'prefix' => 'peminjaman'
], function () {
    Route::get('/', [PeminjamanController::class, 'index']); 
    Route::get('/{id}', [PeminjamanController::class, 'show']);
    Route::post('/', [PeminjamanController::class, 'store']); 
    Route::patch('/{id}', [PeminjamanController::class, 'update']); 
    Route::delete('/{id}', [PeminjamanController::class, 'destroy']); 
});

// DETAIL PEMINJAMAN
Route::group([
    'middleware' => 'api',
    'prefix' => 'detail-peminjaman'
], function () {
    Route::get('/', [DetailPeminjamanController::class, 'index']); 
    Route::get('/{id}', [DetailPeminjamanController::class, 'show']);
    Route::get('/peminjaman/{id}', [DetailPeminjamanController::class, 'getByPeminjaman']);
    Route::post('/', [DetailPeminjamanController::class, 'store']); 
    Route::patch('/{id}', [DetailPeminjamanController::class, 'update']); 
    Route::delete('/{id}', [DetailPeminjamanController::class, 'destroy']); 
});
