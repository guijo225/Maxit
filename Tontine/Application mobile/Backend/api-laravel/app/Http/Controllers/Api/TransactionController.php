<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    //
    public function TransactionDeDepot(Request $request)
    {
        try {

            // Logique pour insérer une transaction
            $validatedData = $request->validate([
                'id_tour' => 'required|exists:tour,id_tour',
                'id_participant' => 'required|exists:participant,id_participant',
                'montant_transaction' => 'required|numeric',
                'date_transaction' => 'required|date',
                'type_transaction' => 'required|string',
                'numero_transaction' => 'required|string',
                'statut_transaction' => 'required|string',
            ]);

            // Créer la transaction
            $transaction = new Transaction($validatedData);
            $transaction->save();

            // Mettre à jour le montant distribué du tour
            $tour = $transaction->tour;
            if ($tour) {
                $tour->montant_distribue += $transaction->montant_transaction;
                $tour->save();
            }

            return response()->json(['message' => 'Transaction insérée avec succès', 'transaction' => $transaction], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'insertion de la transaction', 'details' => $e->getMessage()], 500);
        }
    }


    public function AfficherTransactionsParTour(string $id_tour)
    {
        // Logique pour afficher les transactions par tour
        $transactions = Transaction::where('id_tour', $id_tour)->get();
        if ($transactions->isEmpty()) {
            return response()->json(['message' => 'Aucune transaction trouvée pour ce tour'], 404);
        }

        return response()->json($transactions, 200);
    }

    public function AfficherTransactionsParParticipant(string $id_participant)
    {
        // Logique pour afficher les transactions par participant
        $transactions = Transaction::where('id_participant', $id_participant)->get();
        if ($transactions->isEmpty()) {
            return response()->json(['message' => 'Aucune transaction trouvée pour ce participant'], 404);
        }

        return response()->json($transactions, 200);
    }

    public function transactionRetrait(Request $request)
    {
        // Logique pour gérer une transaction de retrait
        $validatedData = $request->validate([
            'id_tour' => 'required|exists:tour,id_tour',
            'id_participant' => 'required|exists:participant,id_participant',
            'montant_transaction' => 'required|numeric',
            'date_transaction' => 'required|date',
            'numero_transaction' => 'required|string',
        ]);

        // Créer la transaction de retrait
        $transaction = new Transaction($validatedData);
        $transaction->type_transaction = 'retrait';
        $transaction->statut_transaction = 'en attente';
        $transaction->save();

        return response()->json(['message' => 'Transaction de retrait créée avec succès', 'transaction' => $transaction], 201);
    }
}