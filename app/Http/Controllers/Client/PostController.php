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
use Illuminate\Support\Facades\Auth;


class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with([
            'user:id,username,profile_picture',
            'media:id,file_path',
            'reactions.user:id,username,profile_picture',
            'shares.user:id,username,profile_picture'
        ])->latest()->get();
    
        $formattedPosts = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'user' => [
                    'name' => $post->user->username,
                    'avatar' => asset('storage/' . $post->user->profile_picture) // Đảm bảo avatar cũng có URL đầy đủ
                ],
                'content' => $post->content,
                'images' => $post->media->map(function ($media) {
                    return asset('storage/' . $media->file_path);
                })->toArray(),
                'likes' => $post->reactions->count(),
                'likedBy' => $post->reactions->take(5)->map(function ($reaction) {
                    return [
                        'name' => $reaction->user->username,
                        'avatar' => asset('storage/' . $reaction->user->profile_picture),
                        'mutualFriends' => null // Logic để lấy mutual friends nếu cần
                    ];
                }),
                'shares' => $post->shares->count(),
            ];
        });
    
        return response()->json($formattedPosts);
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

        $request->validate([
            'content' => 'nullable|string',
            'type_id' => 'required|exists:types,id',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120', // validate cho nhiều file
        ]);

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'type_id' => $request->type_id,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('posts', $fileName, 'public');

                $media = Media::create([
                    'file_path' => $filePath,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);

                PostMedia::create([
                    'post_id' => $post->id,
                    'media_id' => $media->id,
                ]);

                Log::info('File đã lưu:', [
                    'name' => $fileName,
                    'path' => $filePath,
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                ]);
            }
        } else {
            Log::warning('Không có file nào được tải lên.');
        }

        return response()->json([
            'message' => 'Bài viết đã được tạo thành công!',
            'post' => $post->load(['media' => function ($query) {
                $query->select('id', 'file_path')->get()->each(function ($media) {
                    $media->file_path = asset('storage/' . $media->file_path);
                });
            }]),
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