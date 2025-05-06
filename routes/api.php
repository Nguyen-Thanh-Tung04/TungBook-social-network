<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\RoleController;
use App\Http\Controllers\Admin\Auth\UserController;
use App\Http\Controllers\Client\AuthController;
use App\Http\Controllers\Client\PostController;
use App\Http\Controllers\Client\ReactionController;
use App\Http\Controllers\Client\ShareController;
use App\Http\Controllers\Client\CommentController;
use App\Http\Controllers\Client\FriendController;
use App\Http\Controllers\Client\MessageController; // Ensure this line is present and the class exists in the specified namespace


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Admin routes
Route::resource('roles', RoleController::class);
Route::resource('users', UserController::class);

//Clietn routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);

// Route::apiResource('posts', PostController::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/posts/{id}', [PostController::class, 'update']); // ✅ Thêm dòng này
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']); // Thêm route xóa bài viết
    Route::get('/posts/{id}', [PostController::class, 'show']); 

});
// Không cần prefix 'api' vì đã được Laravel tự động thêm
Route::post('reactions', [ReactionController::class, 'store']);
Route::delete('reactions/{id}', [ReactionController::class, 'destroy']);
Route::post('shares', [ShareController::class, 'store']);

// cập nhật avatar
Route::middleware('auth:sanctum')->post('/user/avatar', [AuthController::class, 'updateAvatar']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

// Reaction
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reactions', [ReactionController::class, 'react']);
    Route::delete('/reactions/post/{postId}', [ReactionController::class, 'destroyByPost']);
});

Route::get('/posts/{id}/likes', [ReactionController::class, 'getLikes']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']); // ✅ Route update

}); 
Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/user/media', [AuthController::class, 'imgProfile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/friends', [FriendController::class, 'getFriends']);
    Route::post('/friends/send/{friend_id}', [FriendController::class, 'sendRequest']);
    Route::put('/friends/accept/{request_id}', [FriendController::class, 'acceptRequest']);
    Route::delete('/friends/remove/{friend_id}', [FriendController::class, 'unfriend']);
    Route::get('/friends/suggestions', [FriendController::class, 'getSuggestions']);
    Route::get('/friends/requests', [FriendController::class, 'getFriendRequests']);

});

// messages
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/{userId}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
});