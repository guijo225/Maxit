<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Om_transactions_simulesController;
use App\Http\Controllers\AssuranceController;

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


Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/om_transactions_simules', [Om_transactions_simulesController::class, 'simulePayment']);
Route::post('/paiementAssurances', [AssuranceController::class, 'paiementAssurances']);

Route::post('/debitCompte', [Om_transactions_simulesController::class, 'debitCompte']);
Route::post('/creditCompte', [Om_transactions_simulesController::class, 'creditCompte']);
