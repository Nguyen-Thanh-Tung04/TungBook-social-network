<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'nullable|exists:roles,id', // Thêm role_id
        ]);
    
        $validated['password'] = Hash::make($validated['password']);
    
        // Gán giá trị role_id mặc định nếu không được cung cấp
        $validated['role_id'] = $validated['role_id'] ?? 1; // ID 1 là vai trò mặc định (ví dụ: 'Khách hàng')
    
        $user = User::create($validated);
    
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }
    

    // Login user
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Logout user
    public function logout(Request $request)
{
    // Kiểm tra nếu người dùng đã xác thực
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    // Xóa token hiện tại
    $user->currentAccessToken()->delete();

    return response()->json(['message' => 'Logout successful']);
}

}
