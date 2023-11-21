<?php

namespace App\Http\Controllers;

use App\Models\KAK;
use App\Models\Proker;
use App\Models\KetuaOrmawa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
class KAKController extends Controller
{
    /**
     * Create a new KAKController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }

    // Method for handling HTTP GET requests to show one data
    public function index()
    {
        $kaks = KAK::with('prokers','ketua_ormawa.ormawa')->get();

        if ($kaks->isEmpty()) {
            return response()->json(['message' => 'No KAKs found'], 404);
        }

        return response()->json($kaks, 200);
    }

    // Method for handling HTTP GET requests
    public function show($id_kak)
    {
        $kaks = KAK::with('prokers', 'ketua_ormawa.ormawa')->where('id_kak', $id_kak)->get();
        
        if ($kaks->isEmpty()) {
            return response()->json(['message' => 'No KAKs found'], 404);
        }
        
        return response()->json($kaks, 200);
    }

    // Method for handling HTTP POST requests to create a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_ketua' => 'required',
            'file_kak' => 'required|file',
            'file_rab' => 'required|file',
            'prokers' => 'required|array', // Validate "prokers" as an array
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Simpan file KAK
        if ($request->hasFile('file_kak')) {
            $fileKAK = $request->file('file_kak');
            $fileNameKAKTemp  = time() . '_' . $fileKAK->getClientOriginalName();
            $fileKAK->move(public_path('uploads'), $fileNameKAKTemp);
            $fileKAKPath = 'uploads/' . $fileNameKAKTemp;
        }

        // Simpan file RAB
        if ($request->hasFile('file_rab')) {
            $fileRAB = $request->file('file_rab');
            $fileNameRABTemp  = time() . '_' . $fileRAB->getClientOriginalName();
            $fileRAB->move(public_path('uploads'), $fileNameRABTemp);
            $fileRABPath = 'uploads/' . $fileNameRABTemp;
        }

        // Create the KAK record with specified fields
        $kak = KAK::create([
            'id_ketua' => $request->input('id_ketua'),
            'file_kak' => $fileKAKPath,
            'file_rab' => $fileRABPath,
            'status' => 'Diajukan', // Set status to "Diajukan"
            'catatan' => '', // Set catatan to an empty string
        ]);

        // Capture the id_kak from the newly created KAK record
        $id_kak = $kak->id_kak;
        // Ubah nama file menjadi menggunakan id_kak yang sudah ada
        if ($id_kak) {
            $newFileNameKAK = $id_kak . '_' . $fileKAK->getClientOriginalName();
            $newFileNameRAB = $id_kak . '_' . $fileRAB->getClientOriginalName();

            // Ubah nama file menjadi id_kak_namafile
            if ($fileKAKPath) {
                rename(public_path('uploads') . '/' . $fileNameKAKTemp, public_path('uploads') . '/' . $newFileNameKAK);
                $fileKAKPath = 'uploads/' . $newFileNameKAK;
            }
            if ($fileRABPath) {
                rename(public_path('uploads') . '/' . $fileNameRABTemp, public_path('uploads') . '/' . $newFileNameRAB);
                $fileRABPath = 'uploads/' . $newFileNameRAB;
            }

            $kak->file_kak = $newFileNameKAK;
            $kak->file_rab = $newFileNameRAB;
            $kak->save();
        }
        // Insert "proker" records associated with the KAK
        $prokers = [];
        if ($request->has('prokers')) {
            foreach ($request->prokers as $prokerData) {
                // Set the id_kak for each proker to the captured id_kak
                $prokerData['id_kak'] = $id_kak;
                $prokerData['status'] = 'Diajukan'; // Set status in Proker to "Diajukan"
                $prokerData['catatan'] = ''; // Set catatan in Proker to an empty string

                // Create and save the proker record
                $proker = Proker::create($prokerData);

                $prokers[] = $proker;
            }
        }
        return response()->json(['kak' => $kak, 'prokers' => $prokers], 201);
    }
   


    // Belum Jalan
    // Method for handling HTTP PUT/PATCH requests to update a product
    // public function update(Request $request, $id)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'id_ketua' => 'required',
    //         'file_kak' => 'file',
    //         'file_rab' => 'file',
    //         'prokers' => 'array',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 400);
    //     }

    //     $kak = KAK::find($id);

    //     if (!$kak) {
    //         return response()->json(['message' => 'KAK not found'], 404);
    //     }

    //     // Update the KAK record
    //     $kak->update($request->except('prokers'));

    //     // Update associated proker records
    //     $prokers = [];
    //     if ($request->has('prokers')) {
    //         foreach ($request->prokers as $prokerData) {
    //             // Jika ID proker tidak ada, berarti ini merupakan proker baru.
    //             if (!isset($prokerData['id_proker'])) {
    //                 $prokerData['id_kak'] = $id;
    //                 $prokerData['status'] = 'Diajukan';
    //                 $prokerData['catatan'] = '';
        
    //                 $proker = Proker::create($prokerData);
    //                 $prokers[] = $proker;
    //             } else {
    //                 $proker = Proker::find($prokerData['id_proker']);
        
    //                 if ($proker) {
    //                     $proker->update($prokerData);
    //                     $prokers[] = $proker;
    //                 } else {
    //                     return response()->json(['message' => 'Proker not found for ID: ' . $prokerData['id']], 404);
    //                 }
    //             }
    //         }
    //     }

    //     return response()->json(['kak' => $kak, 'prokers' => $prokers], 200);
    // }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'file_kak' => 'file',
            'file_rab' => 'file',
            'prokers' => 'required|array', // Validate "prokers" as an array
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $kak = KAK::find($id);

        if (!$kak) {
            return response()->json(['error' => 'KAK not found'], 404);
        }

        // Update file KAK if provided
        if ($request->hasFile('file_kak')) {
            // Delete old file
            if ($kak->file_kak) {
                unlink(public_path('uploads'),($kak->file_kak));
            }

            // Upload new file
            $fileKAK = $request->file('file_kak');
            $fileNameKAK = $id . '_' . $fileKAK->getClientOriginalName();
            $fileKAK->move(public_path('uploads'), $fileNameKAK);
            $kak->file_kak = $fileNameKAK;
        }

        // Update file RAB if provided
        if ($request->hasFile('file_rab')) {
            // Delete old file
            if ($kak->file_rab) {
                unlink(public_path($kak->file_rab));
            }

            // Upload new file
            $fileRAB = $request->file('file_rab');
            $fileNameRAB = $id . '_' . $fileRAB->getClientOriginalName();
            $fileRAB->move(public_path('uploads'), $fileNameRAB);
            $kak->file_rab = $fileNameRAB;
        }

        $kak->save();
        $id_kak = $kak->id_kak;

        // Update or create associated "proker" records
        $prokers = [];
        if ($request->has('prokers')) {
            foreach ($request->input('prokers') as $prokerData) {
                // Jika ID proker tidak ada, berarti ini merupakan proker baru.
                if (!isset($prokerData['id_proker'])) {
                    $prokerData['id_kak'] = $id_kak;
                    $prokerData['status'] = 'Diajukan';
                    $prokerData['catatan'] = '';
        
                    $proker = Proker::create($prokerData);
                    $prokers[] = $proker;
                } else {
                    $proker = Proker::find($prokerData['id_proker']);
        
                    if ($proker) {
                        $proker->update([
                            'nama_kegiatan' => $prokerData['nama_kegiatan'],
                            'jenis_kegiatan' => $prokerData['jenis_kegiatan'],
                            'ketua_pelaksana' => $prokerData['ketua_pelaksana'],
                            'deskrpisi_kegiatan' => $prokerData['deskrpisi_kegiatan'],
                        ]);
                        $prokers[] = $proker;
                    } else {
                        return response()->json(['message' => 'Proker not found for ID: ' . $prokerData['id']], 404);
                    }
                }
            }
        }

        return response()->json(['kak' => $kak, 'prokers' => $prokers], 200);
    }


    // Method for handling HTTP DELETE requests to delete a product
    public function destroy($id)
    {
        $kak = KAK::find($id);
        if (!$kak) {
            return response()->json(['message' => 'KAK not found'], 404);
        }
        
        // Path file yang akan dihapus
        $filePaths = [$kak->file_kak, $kak->file_rab];

        $kak->delete();

        // Hapus file terkait setelah menghapus entitas KAK
        foreach ($filePaths as $filePath) {
            if ($filePath && file_exists(public_path($filePath))) {
                unlink(public_path($filePath));
            }
        }
        return response()->json(['message' => 'KAK deleted'], 200);
    }

    
    // Method for handling HTTP GET requests to show file
    public function getFile($filename)
    {
        $path = public_path('uploads/'. $filename);

        if (!File::exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // $file = File::get($path);
        // $type = File::mimeType($path);

        // $response = response()->make($file, 200);
        // $response->header('Content-Type', $type);

        return response()->file($path, ['Content-Type' => 'application/pdf']);
    }
}