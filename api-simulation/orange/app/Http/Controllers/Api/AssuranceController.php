<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assurance_transaction;
use Illuminate\Support\Str;

class AssuranceController extends Controller
{
    //
    public function paiementAssurances(Request $request)
    {
        try {
            $request->validate([
                'telephone' => 'required',
                'montant' => 'required|numeric',
                'statut' => 'required|string',
                'tontine_id' => 'required|integer',
                'user_id' => 'required|integer',
            ]);

            $transaction_id = 'assur_' . Str::random(20);

            // Assurance_transaction::
            $assurance_transaction = Assurance_transaction::create([
                'phone' => $request->input('telephone'),
                'montant' => $request->input('montant'),
                'statut' => $request->input('statut'),
                'tontine_id' => $request->input('tontine_id'),
                'user_id' => $request->input('user_id'),
                'transaction_id' => $transaction_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $transaction_id,
                'status' => 'Transaction simulée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'status' => 'Échec de la simulation de la transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
