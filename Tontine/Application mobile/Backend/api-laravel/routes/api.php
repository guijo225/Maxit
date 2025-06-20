<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\TontineController;
use App\Http\Controllers\Api\ParticipantController;

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

// Route publique
Route::post('/inscription', [UtilisateurController::class, 'inscription']);
Route::post('/login', [UtilisateurController::class, 'login']);

Route::get('/TontinesParUtilisateur/{id}', [UtilisateurController::class, 'TontinesParUtilisateur']);
// Route protégée
Route::middleware('auth:api')->group(function () {
    Route::get('/tontine/{id}', [TontineController::class, 'afficheTontine']);
    Route::get('/participant/{id}', [ParticipantController::class, 'participantTontine']);
});

