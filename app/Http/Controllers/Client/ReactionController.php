<?php
namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\Reaction;

class ReactionController extends Controller
{
    // Người dùng thả hoặc thay đổi cảm xúc
    public function react(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'reaction_type' => 'required|string|max:50',
        ]);

        $userId = Auth::id();

        $reaction = Reaction::updateOrCreate(
            ['user_id' => $userId, 'post_id' => $request->post_id],
            ['reaction_type' => $request->reaction_type]
        );

        return response()->json([
            'success' => true,
            'reaction' => $reaction
        ]);
    }

    // Gỡ bỏ cảm xúc
    public function destroyByPost($postId)
    {
        $userId = Auth::id();

        $reaction = Reaction::where('user_id', $userId)
            ->where('post_id', $postId)
            ->first();

        if ($reaction) {
            $reaction->delete();
            return response()->json(['message' => 'Reaction removed']);
        }

        return response()->json(['message' => 'No reaction found'], 404);
    }

    // Lấy danh sách người dùng đã "like"
    public function getLikes($postId)
    {
        $reactions = Reaction::with('user:id,username,profile_picture')
            ->where('post_id', $postId)
            ->get();
    
        $reactedBy = $reactions->map(function ($reaction) {
            return [
                'id' => $reaction->user->id,
                'name' => $reaction->user->username,
                'avatar' => asset('storage/' . $reaction->user->profile_picture),
                'reaction' => $reaction->reaction_type, // ✅ thêm loại cảm xúc
                'reacted_at' => $reaction->created_at->toDateTimeString(),
                'mutualFriends' => null,
            ];
        });
    
        return response()->json([
            'post_id' => $postId,
            'total_reactions' => $reactedBy->count(), // ✅ tổng số cảm xúc
            'reactedBy' => $reactedBy,
        ]);
    }
    
}