<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $table = 'medias'; // Chỉ định tên bảng chính xác

    protected $fillable = ['file_path', 'file_type', 'file_size'];
}