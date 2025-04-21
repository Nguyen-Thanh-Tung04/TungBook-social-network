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
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with([
            'user:id,username,profile_picture',
            'media:id,file_path',
            'reactions.user:id,username,profile_picture',
            'shares.user:id,username,profile_picture',
            'comments:id,post_id' // ✅ Thêm quan hệ comments để đếm
        ])->latest()->get();
    
        $formattedPosts = $posts->map(function ($post) {
            $currentUser = Auth::user();
    
            // ✅ Tìm cảm xúc hiện tại của người dùng (nếu có)
            $userReaction = $post->reactions->firstWhere('user_id', $currentUser?->id)?->reaction_type;
    
            // ✅ Tổng hợp loại cảm xúc
            $reactionSummary = $post->reactions()
                ->select('reaction_type', DB::raw('count(*) as count'))
                ->groupBy('reaction_type')
                ->pluck('count', 'reaction_type')
                ->toArray();
    
            $reactionSummary = count($reactionSummary) > 0 ? $reactionSummary : (object)[];
    
            return [
                'id' => $post->id,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->username,
                    'avatar' => asset('storage/' . $post->user->profile_picture),
                ],
                'content' => $post->content,
                'images' => $post->media->map(fn($m) => asset('storage/' . $m->file_path))->toArray(),
                'likes' => $post->reactions->count(),
                'reaction_summary' => $reactionSummary,
                'user_reaction' => $userReaction,
                'likedBy' => $post->reactions->take(5)->map(fn($reaction) => [
                    'name' => $reaction->user->username,
                    'avatar' => asset('storage/' . $reaction->user->profile_picture),
                    'mutualFriends' => null,
                ]),
                'shares' => $post->shares->count(),
                'comments_count' => $post->comments->count(), // ✅ Tổng số bình luận
                'created_at' => $post->created_at->toIso8601String(),
            ];
        });
    
        return response()->json($formattedPosts);
    }
    



    public function update(Request $request, $id)
    {
        try {
            // Validate dữ liệu
            $request->validate([
                'content' => 'required|string',
                'type_id' => 'nullable|exists:types,id',
                'files.*' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120',
            ]);
    
            $post = Post::findOrFail($id);
    
            // Kiểm tra quyền chỉnh sửa
            if ($post->user_id !== Auth::id()) {
                return response()->json(['error' => 'Không có quyền chỉnh sửa bài viết này'], 403);
            }
    
            // Cập nhật nội dung
            $post->content = $request->content;
            $post->type_id = $request->type_id;
            $post->save();
    
            // Nếu có ảnh mới
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
                }
            }
    
            // Load lại media để lấy ảnh mới nhất
            $post->load('media');
    
            // Biến đổi media thành mảng ảnh
            $images = $post->media->map(fn($m) => asset('storage/' . $m->file_path))->toArray();
    
            // Trả về bài viết với hình ảnh mới
            return response()->json([
                'message' => 'Bài viết đã được cập nhật!',
                'post' => array_merge($post->toArray(), [
                    'images' => $images,
                ]),
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
        $post = Post::with([
            'user:id,username,profile_picture',
            'media:id,file_path',
            'comments' => function ($query) {
                $query->orderBy('created_at');
            },
            'comments.user:id,username,profile_picture',
            'comments.replies.user:id,username,profile_picture',
            'comments.replies.replies.user:id,username,profile_picture',
            'comments.replies.replies.replies.user:id,username,profile_picture',
        ])->findOrFail($id);
    
        $comments = $post->comments;
    
        // Nhóm comments theo parent_id
        $grouped = $comments->groupBy('parent_id');
    
        // Đệ quy định dạng comment
        $formatComment = function ($comment) use (&$grouped, &$formatComment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->username,
                    'avatar' => asset('storage/' . $comment->user->profile_picture),
                ],
                'replies' => collect($grouped[$comment->id] ?? [])
                    ->sortBy('created_at')
                    ->map($formatComment)
                    ->values()
            ];
        };
    
        // Format danh sách comment gốc (parent_id = null)
        $commentsFormatted = collect($grouped[null] ?? [])
            ->sortBy('created_at')
            ->map($formatComment)
            ->values();
    
        return response()->json([
            'id' => $post->id,
            'user' => [
                'id' => $post->user->id,
                'name' => $post->user->username,
                'avatar' => asset('storage/' . $post->user->profile_picture)
            ],
            'content' => $post->content,
            'images' => $post->media->map(fn($m) => asset('storage/' . $m->file_path))->toArray(),
            'comments' => $commentsFormatted,
        ]);
    }
    

    public function destroy($id)
    {
        try {
            $post = Post::findOrFail($id);

            // Xóa media liên quan
            foreach ($post->media as $media) {
                // Xóa file trong storage
                Storage::disk('public')->delete($media->file_path);
                // Xóa bản ghi trong bảng media
                $media->delete();
            }

            // Xóa bản ghi trong bảng post_media
            PostMedia::where('post_id', $id)->delete();

            // Xóa các liên kết khác nếu cần (reactions, shares, v.v.)
            $post->reactions()->delete();
            $post->shares()->delete();

            // Cuối cùng, xóa bài viết
            $post->delete();

            return response()->json(['message' => 'Bài viết đã bị xóa'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa bài viết thất bại!'], 500);
        }
    }
}