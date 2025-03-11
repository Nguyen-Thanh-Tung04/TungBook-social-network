<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reaction;

class ReactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'post_id' => 'required|exists:posts,id',
            'reaction_type' => 'required|string|max:50',
        ]);

        $reaction = Reaction::create($validated);

        return response()->json($reaction, 201);
    }

    public function destroy($id)
    {
        $reaction = Reaction::findOrFail($id);
        $reaction->delete();

        return response()->json(['message' => 'Reaction removed successfully']);
    }
} 