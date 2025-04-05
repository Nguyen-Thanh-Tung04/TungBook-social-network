<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id', // ✅ hỗ trợ trả lời
        ]);
    
        $comment = Comment::create([
            'post_id' => $validated['post_id'],
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);
    
        $user = $comment->user()->select('id', 'username', 'profile_picture')->first();
    
        return response()->json([
            'message' => 'Bình luận đã được tạo.',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'parent_id' => $comment->parent_id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->username,
                    'avatar' => $user->profile_picture
                        ? asset('storage/' . $user->profile_picture)
                        : 'https://i.pravatar.cc/150?u=' . $user->id,
                ],
            ],
        ], 201);
    }
    
    

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // ✅ Kiểm tra quyền: chỉ người tạo bình luận được sửa
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền cập nhật bình luận này.'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update(['content' => $validated['content']]);

        $user = $comment->user()->select('id', 'username', 'profile_picture')->first();

        return response()->json([
            'message' => 'Cập nhật bình luận thành công.',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->username,
                    'avatar' => $user->profile_picture
                        ? asset('storage/' . $user->profile_picture)
                        : 'https://i.pravatar.cc/150?u=' . $user->id,
                ],
            ],
        ]);
    }
}