<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Om_transactions_simules;
use Illuminate\Support\Str;

use App\Services\TransactionService;
use function PHPUnit\Framework\returnArgument;

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
            $transaction_id = 'om_' . Str::random(20);

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

    public function debitCompte(Request $request)
    {
        // information recu
        //   {
        //     amount: "1000", // Montant à débiter
        //     currency: "EUR", //devise
        //     externalId: "123456",
        //     payer: { partyIdType: "MSISDN", partyId: "46732123450" }, // Numéro fictif
        //     payerMessage: "debit",
        //     payeeNote: "Sandbox",
        //   }

        $value = $request->validate([
            'amount' => "required|string",
            'currency' => "required|string",
            'externalId' => "required|string",
            'payer' => "required|array",
            'payerMessage' => "required|string",
            'payeeNote' => "string",
        ]);
        $transactionService = new TransactionService();

        $response = $transactionService->debitCompte($value);

        return $response;
    }

    public function creditCompte(Request $request)
    {
        // Validation des données entrantes
        $value = $request->validate([
            'amount' => "required|string",
            'currency' => "required|string",
            'externalId' => "required|string",
            'payer' => "required|array",
            'payerMessage' => "required|string",
            'payeeNote' => "string",
        ]);

        $transactionService = new TransactionService();

        $response = $transactionService->creditCompte($value);

        return $response;
    }

}
