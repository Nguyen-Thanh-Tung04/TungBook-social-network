<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'content', 'group_id', 'type_id'];

    // Liên kết với user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Liên kết với nhiều media
    public function media()
    {
        return $this->hasManyThrough(Media::class, PostMedia::class, 'post_id', 'id', 'id', 'media_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags');
    }
    // Post.php
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }


    public function shares()
    {
        return $this->hasMany(Share::class);
    }
}