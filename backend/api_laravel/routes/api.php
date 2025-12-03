<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\TontineController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\PenaliteController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CotisationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UtilisateurController;


Route::apiResource('participant', ParticipantController::class);
Route::apiResource('tontine', TontineController::class);
Route::apiResource('penalite', PenaliteController::class);

//Routes pour les tours
Route::apiResource('tour', TourController::class);
Route::post('ajoutTour/{id}', [TourController::class, "ajouter"]);
Route::get('/tour/{id}', [TourController::class, 'afficheTour']);
Route::get('/changerDeTour/{id}', [TourController::class, 'changerDeTour']);


Route::get('penalites/', [PenaliteController::class, "penalites"]);
Route::get('assurances/', [PenaliteController::class, "assurances"]);

//Routes d'inscription et connexion
Route::post('/inscription', [UtilisateurController::class, 'inscription']);
Route::get('/login/{id}', [UtilisateurController::class, 'login']);

Route::get('/tontine/{id}', [TontineController::class, 'afficheTontine']);

Route::get('/participant/{id}', [ParticipantController::class, 'participantTontine']);
Route::get('/recupererParticipant', [ParticipantController::class, 'recupererParticipant']);


//Routes api de transactions
Route::post('/TransactionDeDepot', [TransactionController::class, 'TransactionDeDepot']);
Route::post('transactionRetrait', [TransactionController::class, 'transactionRetrait']);
Route::get('/AfficherTransactionsParTour/{id_tour}', [TransactionController::class, 'AfficherTransactionsParTour']);
Route::get('/AfficherTransactionsParParticipant/{id_participant}', [TransactionController::class, 'AfficherTransactionsParParticipant']);

//Routes api de cotisations
Route::post('/insererCotisation', [CotisationController::class, 'insererCotisation']);
Route::get('/AfficherCotisationParTour/{id_tour}', [CotisationController::class, 'AfficherCotisationParTour']);
Route::get('/AfficherCotisationParParticipant/{id_participant}', [CotisationController::class, 'AfficherCotisationParParticipant']);
Route::get('/afficherReglementTontine/{id}', [TontineController::class, 'afficherReglementTontine']);

Route::post('/update-ordre', [ParticipantController::class, 'updateOrdre']);


//Routes Notifications
Route::get('/getNotification/{id}/{tontineId}', [ParticipantController::class, 'getNotification']);
Route::post('/getNotificationsTontine', [NotificationController::class, 'getNotificationsTontine']);
Route::post('/countNotifications', [NotificationController::class, 'countNotifications']);
