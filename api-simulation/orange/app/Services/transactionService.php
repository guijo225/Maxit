<?php
namespace App\Services;

use App\Models\Om_transactions_simules;
use Illuminate\Support\Str;

class TransactionService
{
    public function debitCompte($value)
    {

        try {
            $transaction_id = 'om_' . Str::random(20);

            $transaction = Om_transactions_simules::create([
                'phone' => $value['payer']['partyId'],
                'montant' => $value['amount'],
                'statut' => $value['payerMessage'],
                'transaction_id' => $transaction_id,
                'miniApp' => "vinted",
            ]);

            return response()->json([
                "financialTransactionId" => $transaction_id,
                "externalId" => "123456",
                "amount" => $value['amount'],
                "currency" => "FCFA",
                "payer" => [
                    "partyIdType" => "MSISDN",
                    "partyId" => $value['payer']['partyId']
                ],
                "payerMessage" => "debit",
                "payeeNote" => "SimulationOrange",
                "status" => "SUCCESSFUL"
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 'INTERNAL_PROCESSING_ERROR',
                'message' => 'Erreur lors de la création de la transaction.',
                'details' => $e->getMessage()
            ], 500);
        }

    }

    public function creditCompte($value)
    {
        try {
            $transaction_id = 'om_' . Str::random(20);

            $transaction = Om_transactions_simules::create([
                'phone' => $value['payer']['partyId'],   // le bénéficiaire du crédit
                'montant' => $value['amount'],
                'statut' => $value['payerMessage'],
                'transaction_id' => $transaction_id,
                'miniApp' => "vinted",
            ]);

            return response()->json([
                "financialTransactionId" => $transaction_id,
                "externalId" => $value['externalId'],
                "amount" => $value['amount'],
                "currency" => $value['currency'],
                "payerNote" => [
                    "partyIdType" => "MSISDN",
                    "partyId" => $value['payer']['partyId']
                ],
                "payerMessage" => $value['payerMessage'],
                "payeeNote" => $value['payerNote'] ?? "SimulationOrange",
                "status" => "SUCCESSFUL"
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 'INTERNAL_PROCESSING_ERROR',
                'message' => 'Erreur lors de la simulation du crédit.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

}