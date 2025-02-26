<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Media;
use App\Models\PostMedia;
use App\Models\PostTag;
use Carbon\Carbon;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::with('user')->latest()->get());
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'content' => 'required|string',
                'type_id' => 'nullable|exists:types,id'
            ]);

            $post = Post::findOrFail($id);
            $post->update($request->all());

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
        Log::info('Dữ liệu nhận từ frontend:', $request->all());
    
        // Validate dữ liệu đầu vào
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'nullable|string',
            'type_id' => 'required|exists:types,id',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120' // 5MB
        ]);
    
        // Tạo bài viết
        $post = Post::create([
            'user_id' => $request->user_id,
            'content' => $request->content,
            'type_id' => $request->type_id,
        ]);
    
        // Xử lý file ảnh nếu có
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('posts', $fileName, 'public'); // Lưu vào storage/app/public/posts
    
            // Lưu vào bảng medias
            $media = Media::create([
                'file_path' => $filePath,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
            ]);
    
            // Ghi log file đã nhận
            Log::info('File đã lưu:', [
                'name' => $fileName,
                'path' => $filePath,
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ]);
    
            // Liên kết bài viết với ảnh trong post_medias
            PostMedia::create([
                'post_id' => $post->id,
                'media_id' => $media->id,
            ]);
        } else {
            Log::warning('Không có file nào được tải lên.');
        }
    
        return response()->json([
            'message' => 'Bài viết đã được tạo thành công!',
            'post' => $post->load('media'), // Load ảnh liên quan
        ], 201);
    }
    
    public function show($id)
    {
        return response()->json(Post::with('user')->findOrFail($id));
    }

    public function destroy($id)
    {
        Post::findOrFail($id)->delete();
        return response()->json(['message' => 'Bài viết đã bị xóa']);
    }
}