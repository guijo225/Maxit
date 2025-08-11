<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\Om_transactions_simulesController;
use App\Http\Controllers\Api\AssuranceController;

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

Route::get('/users/{id}', [UsersController::class, 'show']);
Route::get('/om_transactions_simules/', [Om_transactions_simulesController::class, 'getAllTransactions']);
Route::post('/om_transactions_simules', [Om_transactions_simulesController::class, 'simulePayment']);
Route::get('/om_transactions_simules/{id}', [Om_transactions_simulesController::class, 'getTransaction']);
Route::post('/paiementAssurances', [AssuranceController::class, 'paiementAssurances']);
