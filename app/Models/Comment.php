<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content',
    ];

    // 💬 Một bình luận thuộc về 1 bài viết
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // 👤 Một bình luận được viết bởi một người dùng
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔁 Một bình luận có thể là phản hồi cho 1 bình luận khác
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // 🔁 Một bình luận có thể có nhiều phản hồi
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('created_at');
    }
    
}