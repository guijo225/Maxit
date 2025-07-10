<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;


use Illuminate\Http\Request;
use App\Models\Users;

class UsersController extends Controller
{
    //
    public function show(string $id)
    {
        $user = Users::find($id);
        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouver'], 404);
        }
        return response()->json($user);
    }
}
