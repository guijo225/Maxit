<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Om_transactions_simules;
use Illuminate\Support\Str;

class Om_transactions_simulesController extends Controller
{
    public function simulePayment(Request $request)
    {
        $request->validate([
            'telephone' => 'required',
            'montant' => 'required|numeric',
            'statut' => 'required|string',
        ]);

        try {
            $transaction_id = Str::random(20);

            $transaction = Om_transactions_simules::create([
                'phone' => $request->input('telephone'),
                'montant' => $request->input('montant'),
                'statut' => $request->input('statut'),
                'transaction_id' => $transaction_id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $transaction,
                'status' => 'Transaction simulée avec succès',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'status' => 'Échec de la simulation de la transaction',
                'message' => 'Erreur lors de la création de la transaction.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTransaction($id)
    {
        $transactions = Om_transactions_simules::where('user_id', $id)->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune transaction trouvée pour cet utilisateur.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    public function getAllTransactions()
    {
        $transactions = Om_transactions_simules::all();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }
}
