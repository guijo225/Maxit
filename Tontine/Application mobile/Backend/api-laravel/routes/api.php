<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\TontineController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CotisationController;

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


Route::post('/inscription', [UtilisateurController::class, 'inscription']);
Route::get('/login/{id}', [UtilisateurController::class, 'login']);
Route::get('/tontine/{id}', [TontineController::class, 'afficheTontine']);
Route::get('/participant/{id}', [ParticipantController::class, 'participantTontine']);

Route::get('/tour/{id}', [TourController::class, 'afficheTour']);
Route::get('/changerDeTour/{id}', [TourController::class, 'changerDeTour']);

Route::post('/TransactionDeDepot', [TransactionController::class, 'TransactionDeDepot']);
Route::post('transactionRetrait', [TransactionController::class, 'transactionRetrait']);
Route::get('/AfficherTransactionsParTour/{id_tour}', [TransactionController::class, 'AfficherTransactionsParTour']);
Route::get('/AfficherTransactionsParParticipant/{id_participant}', [TransactionController::class, 'AfficherTransactionsParParticipant']);

Route::post('/insererCotisation', [CotisationController::class, 'insererCotisation']);
Route::get('/AfficherCotisationParTour/{id_tour}', [CotisationController::class, 'AfficherCotisationParTour']);
Route::get('/AfficherCotisationParParticipant/{id_participant}', [CotisationController::class, 'AfficherCotisationParParticipant']);
Route::get('/afficherReglementTontine/{id}', [TontineController::class, 'afficherReglementTontine']);
Route::post('/update-ordre', [ParticipantController::class, 'updateOrdre']);

