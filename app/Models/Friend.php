<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friend extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'friend_id', 'status'];

    /**
     * Người gửi lời mời kết bạn
     */
    public function requester()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Người nhận lời mời kết bạn
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'friend_id');
    }
}