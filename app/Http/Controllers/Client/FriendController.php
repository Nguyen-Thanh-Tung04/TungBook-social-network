<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Friend;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\PostMedia;
use App\Models\Media;
use App\Models\PostMedia as PostMediaModel;


class FriendController extends Controller
{
    // Lấy danh sách bạn bè
    public function getFriends()
    {
        $userId = Auth::id();

        $friends = Friend::where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->orWhere('friend_id', $userId);
        })
            ->where('status', 'accepted')
            ->get()
            ->map(function ($friend) use ($userId) {
                // Trả về user còn lại (bạn của mình)
                $friendUserId = $friend->user_id === $userId ? $friend->friend_id : $friend->user_id;
                $user = User::find($friendUserId);
                return [
                    'id' => $user->id,
                    'name' => $user->username,
                    'avatar' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
                    'status' => 'accepted',
                    'mutualFriends' => 0, // nếu muốn tính bạn chung thì bổ sung logic sau
                ];
            });

        return response()->json([
            'friends' => $friends
        ]);
    }
    // API: Lấy danh sách lời mời kết bạn đến user hiện tại
    public function getFriendRequests()
    {
        $userId = Auth::id();

        $requests = Friend::where('friend_id', $userId)
            ->where('status', 'pending')
            ->get()
            ->map(function ($request) {
                $user = User::find($request->user_id);
                return [
                    'id' => $user->id,
                    'request_id' => $request->id,
                    'name' => $user->username,
                    'avatar' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
                    'status' => 'pending',
                    'mutualFriends' => 0,
                ];
            });

        return response()->json(['friends' => $requests]);
    }

    // Gửi lời mời kết bạn
    public function sendRequest($friend_id)
    {
        $user = Auth::id();

        if ($user == $friend_id) {
            return response()->json(['error' => 'Không thể kết bạn với chính mình.'], 400);
        }

        $exists = Friend::where(function ($query) use ($user, $friend_id) {
            $query->where('user_id', $user)->where('friend_id', $friend_id);
        })->orWhere(function ($query) use ($user, $friend_id) {
            $query->where('user_id', $friend_id)->where('friend_id', $user);
        })->first();

        if ($exists) {
            return response()->json(['error' => 'Yêu cầu đã tồn tại hoặc đã là bạn bè.'], 409);
        }

        Friend::create([
            'user_id' => $user,
            'friend_id' => $friend_id,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Đã gửi lời mời kết bạn.']);
    }

    // Chấp nhận kết bạn
    public function acceptRequest($request_id)
    {
        $request = Friend::where('id', $request_id)->where('friend_id', Auth::id())->firstOrFail();
        $request->status = 'accepted';
        $request->save();

        return response()->json(['message' => 'Đã chấp nhận lời mời kết bạn.']);
    }

    // Hủy kết bạn
    public function unfriend($friend_id)
    {
        $user = Auth::id();

        Friend::where(function ($q) use ($user, $friend_id) {
            $q->where('user_id', $user)->where('friend_id', $friend_id);
        })->orWhere(function ($q) use ($user, $friend_id) {
            $q->where('user_id', $friend_id)->where('friend_id', $user);
        })->delete();

        return response()->json(['message' => 'Đã hủy kết bạn.']);
    }

    public function getSuggestions()
    {
        $userId = Auth::id();

        // Lấy danh sách ID đã có mối quan hệ kết bạn (pending, accepted, blocked)
        $relatedIds = Friend::where('user_id', $userId)
            ->orWhere('friend_id', $userId)
            ->pluck('user_id')
            ->merge(
                Friend::where('user_id', $userId)
                    ->orWhere('friend_id', $userId)
                    ->pluck('friend_id')
            )
            ->unique()
            ->toArray();

        // Loại bỏ bản thân khỏi danh sách
        $relatedIds[] = $userId;

        // Lấy những user không có trong danh sách kết bạn
        $suggestedUsers = User::whereNotIn('id', $relatedIds)
            ->select('id', 'username as name', 'profile_picture')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
                    'status' => 'suggested',
                    'mutualFriends' => 0
                ];
            });

        return response()->json(['friends' => $suggestedUsers]);
    }
}