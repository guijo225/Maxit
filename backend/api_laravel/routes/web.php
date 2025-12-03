<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\TontineController;

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/participant', [ParticipantController::class, 'participant']);
// Route::get('/tontine', [TontineController::class, 'tontine']);