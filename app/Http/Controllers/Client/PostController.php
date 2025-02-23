<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;  // Đảm bảo import đúng cách


use App\Models\Post;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Danh sách bài viết
    public function index()
    {
        return response()->json(Post::with('user')->latest()->get());
    }

    // Cập nhật bài viết
public function update(Request $request, $id)
{
    try {
        // Kiểm tra và validate dữ liệu
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'type_id' => 'nullable|exists:types,id'
        ]);

        // Tìm bài viết cần cập nhật
        $post = Post::findOrFail($id);

        // Cập nhật bài viết
        $post->update($request->all());

        // Trả về phản hồi
        return response()->json([
            'message' => 'Bài viết đã được cập nhật!',
            'post' => $post
        ], 200);
    } catch (ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Đã xảy ra lỗi!'], 500);
    }
}


public function store(Request $request)
{
    try {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id',  // Xác thực user_id có tồn tại trong bảng users
            'type_id' => 'required|exists:types,id',  // Xác thực type_id có tồn tại trong bảng types
            'file' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:10240',  // Kiểm tra file nếu có
        ]);

        // Tạo bài viết
        $post = new Post();
        $post->user_id = $request->user_id;
        $post->content = $request->content;
        $post->type_id = $request->type_id;

        // Lưu file nếu có
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('posts');  // Lưu file vào thư mục posts
            $post->file_path = $filePath;  // Lưu đường dẫn file
        }

        // Lưu bài viết vào cơ sở dữ liệu
        $post->save();

        return response()->json([
            'message' => 'Bài viết đã được đăng!',
            'post' => $post
        ], 201);
    } catch (\Exception $e) {
        // Ghi lỗi vào log và trả về thông báo lỗi
        Log::error($e->getMessage());
        return response()->json(['error' => 'Đã xảy ra lỗi khi đăng bài!'], 500);
    }
}

    // Xem bài viết
    public function show($id)
    {
        return response()->json(Post::with('user')->findOrFail($id));
    }

    // Xóa bài viết
    public function destroy($id)
    {
        Post::findOrFail($id)->delete();
        return response()->json(['message' => 'Bài viết đã bị xóa']);
    }
}