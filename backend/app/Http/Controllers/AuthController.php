<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\KetuaOrmawa;
use App\Models\Ormawa;
use Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'userData']]);
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }        
        return $this->createNewToken($token);
    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'username' => 'required',
            'role' => 'required'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * get Data Ketua
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getKetuaOrmawa($id) {
        $KetuaOrmawa = KetuaOrmawa::where('id_pengguna', $id)->first();
        $id_ormawa = $KetuaOrmawa->ormawa->id_ormawa;
        $Ormawa = Ormawa::where('id_ormawa', $id_ormawa)->first();

        if (!$KetuaOrmawa) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        return response()->json(['data' => $KetuaOrmawa], 200);
    }

    public function getAllUsers() {
        $users = User::all();
    
        return response()->json(['users' => $users], 200);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */

     
    public function userData($id)
    {
        $userData = User::find($id);

        if (!$userData) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($userData);
    }

    public function editProfil(Request $request, $id_user)
    {
        $user = User::find($id_user);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'nama' => 'required|string',
            'username' => 'required|string|unique:users,username,' . $id_user . ',id_user',
            'email' => 'required|string|unique:users,email,' . $id_user . ',id_user',
            // Add more validation rules for other fields as needed
        ]);
        
        $user->update($validatedData);

        return response()->json(['message' => 'Profile updated successfully']);
    }


    public function ubahPassword(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|different:old_password',
            'new_password_confirmation' => 'required|string|same:new_password',
        ]);

        // Periksa apakah old password sesuai dengan password saat ini di database
        if (!Hash::check($validatedData['old_password'], $user->password)) {
            return response()->json(['message' => 'Old password is incorrect'], 422);
        }

        // Update password ke yang baru
        $user->update([
            'password' => Hash::make($validatedData['new_password']),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function ubahPasswordAdmin(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $rules = [
            'new_password' => 'required|string|min:6',
            'new_password_confirmation' => 'required|string|same:new_password',
        ];

        $validatedData = $request->validate($rules);

        // Update password ke yang baru
        $user->update([
            'password' => Hash::make($validatedData['new_password']),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    /**
     * Delete a User.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAccount($id) {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User successfully deleted'], 200);
    }

    /**
     * Edit User Information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function editAccount(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'nama' => 'string|between:2,100',
            'email' => 'string|email|max:100|unique:users,email,' . $id,
            'password' => 'string|confirmed|min:6',
            'username' => 'string|unique:users,username,' . $id,
            'role' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $validator->validated();

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);

        return response()->json(['message' => 'User successfully updated', 'user' => $user], 200);
    }
    
}