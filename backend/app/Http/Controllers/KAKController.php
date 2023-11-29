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
            $fileKAK->move(public_path('uploads/kak'), $fileNameKAKTemp);
        }

        // Simpan file RAB
        if ($request->hasFile('file_rab')) {
            $fileRAB = $request->file('file_rab');
            $fileNameRABTemp  = time() . '_' . $fileRAB->getClientOriginalName();
            $fileRAB->move(public_path('uploads/kak'), $fileNameRABTemp);
        }

        // Create the KAK record with specified fields
        $kak = KAK::create([
            'id_ketua' => $request->input('id_ketua'),
            'file_kak' => $fileNameKAKTemp,
            'file_rab' => $fileNameRABTemp,
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
            if ($fileNameKAKTemp) {
                $oldFilePathKAK = public_path('uploads/kak') . '/' . $fileNameKAKTemp;
                $newFilePathKAK = public_path('uploads/kak') . '/' . $newFileNameKAK;
                rename($oldFilePathKAK, $newFilePathKAK);
            }
            if ($fileNameRABTemp) {
                $oldFilePathRAB = public_path('uploads/kak') . '/' . $fileNameRABTemp;
                $newFilePathRAB = public_path('uploads/kak') . '/' . $newFileNameRAB;
                rename($oldFilePathRAB, $newFilePathRAB);
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
   
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            // 'file_kak' => 'file',
            // 'file_rab' => 'file',
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
                unlink(public_path('uploads/kak') . '/' . $kak->file_kak);
            }

            // Upload new file
            $fileKAK = $request->file('file_kak');
            $fileNameKAK = $id . '_' . $fileKAK->getClientOriginalName();
            $fileKAK->move(public_path('uploads/kak'), $fileNameKAK);
            $kak->file_kak = $fileNameKAK;
        }

        // Update file RAB if provided
        if ($request->hasFile('file_rab')) {
            // Delete old file
            if ($kak->file_rab) {
                unlink(public_path('uploads/kak') . '/' . $kak->file_rab);
            }

            // Upload new file
            $fileRAB = $request->file('file_rab');
            $fileNameRAB = $id . '_' . $fileRAB->getClientOriginalName();
            $fileRAB->move(public_path('uploads/kak'), $fileNameRAB);
            $kak->file_rab = $fileNameRAB;
        }

        $kak->save();
        $id_kak = $kak->id_kak;

        // Update or create associated "proker" records
        $new_prokers = [];
        if ($request->has('prokers')) {
            foreach ($request->input('prokers') as $prokerData) {
                // Jika ID proker tidak ada atau null, berarti ini merupakan proker baru.
                if ($prokerData['id_proker']) {
                    $proker = Proker::find($prokerData['id_proker']);

                    if ($proker) {
                        $proker->update([
                            'nama_kegiatan' => $prokerData['nama_kegiatan'],
                            'jenis_kegiatan' => $prokerData['jenis_kegiatan'],
                            'ketua_pelaksana' => $prokerData['ketua_pelaksana'],
                            'deskripsi_kegiatan' => $prokerData['deskripsi_kegiatan'],
                        ]);
                        $new_prokers[] = $proker;
                    } else {
                        return response()->json(['message' => 'Proker not found for ID: ' . $prokerData['id_proker']], 404);
                    }
                } else {
                    $prokerData['id_kak'] = $id_kak;
                    $prokerData['status'] = 'Diajukan';
                    $prokerData['catatan'] = '';

                    $new_proker = Proker::create($prokerData);
                    $new_prokers[] = $new_proker;
                }
            }
        }

        // Setelah semua proker ditambahkan, kirim respons
        return response()->json(['kak' => $kak, 'prokers' => $new_prokers], 200);

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
        $path = public_path('uploads/kak/'. $filename);

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