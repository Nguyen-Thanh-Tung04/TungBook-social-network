<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    public function index($userId)
    {
        $currentUserId = auth()->id();
    
        $messages = Message::where(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)->where('receiver_id', $userId);
        })->orWhere(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)->where('receiver_id', $currentUserId);
        })->orderBy('created_at')->get();
    
        return response()->json($messages);
    }
    
    public function store(Request $request)
    {
        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
        ]);
    
        // Gửi event WebSocket nếu có
    
        return response()->json($message);
    }
}