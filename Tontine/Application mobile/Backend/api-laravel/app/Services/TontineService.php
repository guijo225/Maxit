<?php

namespace App\Services;

use App\Models\Cotisation;
use App\Models\Tour;
use App\Models\Tontine;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\TourController;
use Illuminate\Http\Request;

class TontineService
{
    /**
     * Insérer une cotisation et gérer la distribution si la cagnotte est complète.
     */
    public function insererCotisation($validatedData)
    {
        // Appel à l'API OM pour simuler une transaction de dépôt
        $response = Http::post('http://192.168.252.213:8001/api/om_transactions_simules',[
            'telephone' => $validatedData['telephone'],
            'montant' => $validatedData['montant_cotise'],
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

        $data = $response->json();

        $motant_cotise = $validatedData['montant_cotise']/1.025;

        // Enregistre la cotisation dans la base de données
        $cotisation = new Cotisation();
        $cotisation->montant_cotise = $motant_cotise;
        $cotisation->id_tour = $validatedData['id_tour'];
        $cotisation->id_participant = $validatedData['id_participant'];
        $cotisation->numero_paiement = $data['data']['transaction_id'];
        $cotisation->statut_paiement_cotisation = $data['status'];
        $cotisation->mode_paiement = 'mobile money';
        $cotisation->date_cotisation = now();
        $cotisation->save();

        // Met à jour le montant distribué du tour associé
        $tour = $cotisation->tour;
        if ($tour) {
            $tour->montant_distribue += $cotisation->montant_cotise;

            // Récupère la tontine associée au tour
            $tontine = Tontine::find($tour->id_tontine);

            // Vérifie si la cagnotte est pleine (montant distribué atteint le montant total)
            if ($tour->montant_distribue >= $tontine->montant_total) {

                // Prépare les données pour récupérer le participant bénéficiaire
                $donneesPart = [
                    'numero_ordre' => $tour->numero_tour,
                    'id_tontine' => $tour->id_tontine
                ];

                $request = new Request($donneesPart);

                // Récupère le participant bénéficiaire via le contrôleur
                $participantController = new ParticipantController();
                $participant = $participantController->recupererParticipant($request)->getData(true);

                // Vérifie si 'utilisateur' existe
                if (!isset($participant['utilisateur']) || !$participant['utilisateur']) {
                    // Gère le cas d'erreur ici, exemple :
                    throw new \Exception('Participant ou utilisateur non trouvé');
                }

                // Effectue le transfert de la cagnotte au bénéficiaire via une API externe
                $responseTransfert = Http::post('http://192.168.252.43:8000/paiement',[
                    'numero' => $participant['utilisateur']['telephone'],
                    'tontine_id' => $tour->id_tontine,
                    'tour_id' => $tour->id_tour,
                ]);

                // Vérifie si le transfert a échoué
                if (!$responseTransfert->successful()) {
                    return [
                        'success' => false,
                        'message' => 'Erreur lors du transfert',
                        'details' => $responseTransfert->body()
                    ];
                }

                $donnees_tour =new Request([
                    'id_tontine' => $tour->id_tontine,
                    'montant_distribue' => $tour->montant_distribue,
                    'numero_tour' => $tour->numero_tour,
                    'date_debut_tour' => $tour->date_debut_tour,
                    'date_fin_tour' => $tour->date_fin_tour,
                ]);

                // Passe au tour suivant en appelant le contrôleur approprié
                $controller = new TourController();
                $results = $controller->changerDeTour($donnees_tour, $tour->id_tontine);

                // Vérifie si le changement de tour a échoué
                if ($results->getStatusCode() !== 200) {
                    return [
                        'success' => false,
                        'message' => 'Erreur lors du changement de tour'
                    ];
                }

                // Marque le tour comme terminé
                $tour->statut_tour = 'terminé';
            }

            // Sauvegarde les modifications du tour
            $tour->save();
        }

        // Retourne le succès de l'opération avec les données de la cotisation
        return [
            'success' => true,
            'message' => 'Cotisation insérée avec succès',
            'data' => $cotisation
        ];
    }
}

