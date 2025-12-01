<?php

namespace App\Services;

use App\Models\Tontine;
use App\Models\Tour;
use Illuminate\Support\Facades\Http;

class PaiementService
{
    public function validerTransactionAssur(array $data)
    {
        try {
            // Appel à l'API de l'assurance pour simuler une transaction de dépôt
            $response = Http::post('http://192.168.252.211:8001/api/paiementAssurances', [
                'telephone' => $data['telephone'],
                'montant' => $data['montant_cotise'],
                'statut' => 'depot',
                'id_tour' => $data['id_tour'],
                'id_participant' => $data['id_participant'],
                // 'tontine_id' => $data['tontine_id'],
            ]);

            // Vérifie si la transaction a échoué
            if (!$response->successful()) {
                return [
                    'success' => false,
                    'message' => 'Échec du paiement assurance',
                    'details' => $response->body()
                ];
            }
            $resData = $response->json();
            return [
                'success' => true,
                'transaction_id' => $resData['data'],
                'status' => $resData['status']
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Échec du paiement OM erreur: ' . $e,
            ];
        }
    }

    public function validerTransactionOM(array $data)
    {
        try {
            // Appel à l'API OM pour simuler une transaction de dépôt
            $response = Http::post('http://192.168.252.211:8001/api/om_transactions_simules', [
                'telephone' => $data['telephone'],
                'montant' => $data['montant_cotise'],
                'statut' => 'depot',
            ]);

            // Vérifie si la transaction a échoué
            if (!$response->successful()) {
                return [
                    'success' => false,
                    'message' => 'Échec du paiement OM',
                    'details' => $response->body()
                ];
            }
            $resData = $response->json();
            return [
                'success' => true,
                'transaction_id' => $resData['data']['transaction_id'],
                'status' => $resData['status']
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Échec du paiement OM erreur: ' . $e,
            ];
        }
    }

    public function effectuerTransfert(Tour $tour, Tontine $tontine, array $participant)
    {
        $response = Http::post('http://192.168.252.202:8000/paiement', [
            'numero' => $participant['utilisateur']['telephone'],
            'tontine_id' => $tour->id_tontine,
            'tour_id' => $tour->id_tour,
            'montant_distribue' => $tour->montant_distribue,
            'montant_total' => $tontine->montant_total
        ]);

        if (!$response->successful()) {
            throw new \Exception('Erreur lors du transfert : ' . $response->body());
        }
    }


}