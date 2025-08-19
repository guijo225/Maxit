<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assurance_transaction;
use Illuminate\Support\Facades\Http;
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
                'id_tour' => 'required|integer',
                'id_participant' => 'required|integer',
                // 'tontine_id' => 'required|integer',
            ]);

            $transaction_id = 'assur_' . Str::random(20);

            // Assurance_transaction::
            $assurance_transaction = Assurance_transaction::create([
                'phone' => $request->input('telephone'),
                'montant' => $request->input('montant'),
                'statut' => 'rembourssement',
                'id_tour' => $request->input('id_tour'),
                'id_participant' => $request->input('id_participant'),
                // 'tontine_id' => $request->input('tontine_id'),
                'transaction_id' => $transaction_id,
            ]);

            if ($assurance_transaction->exists()) {

                // $donneCotisation = new Request([
                //     'montant_cotise' => $request->input('montant'),
                //     'id_tour' => $request->input('id_tour'),
                //     'id_participant' => $request->input('id_participant'),
                //     'telephone' => $request->input('telephone'),
                //     'mode_paiement' => 'Assurance',
                // ]);

                //$response = Http::post('http://192.168.252.228:8000/api/insererCotisation', $donneCotisation);

                // Appel à l'API OM pour simuler une transaction de dépôt

                /*$response = Http::post('http://192.168.252.228:8001/api/om_transactions_simules', [
                    'telephone' => $request->input('telephone'),
                    'montant' => $request->input('montant'),
                    'statut' => 'depot',
                ]);*/

            }
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
