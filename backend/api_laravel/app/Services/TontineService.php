<?php

namespace App\Services;

use App\Models\Cotisation;
use App\Models\Penalite;
use App\Models\Tour;
use App\Models\Tontine;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\Participant;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\TourController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class TontineService
{
    public function insererCotisation($validatedData)
    {
        $paiementService = new \App\Services\PaiementService();
        // 1. Valider la transaction OM
        switch (strtolower($validatedData['mode_paiement'])) {
            case 'assurance':
                $transactionData = $paiementService->validerTransactionAssur($validatedData);
                break;
            case 'mobile money':
                $transactionData = $paiementService->validerTransactionOM($validatedData);
                break;
            default:
                return ['success' => false, 'message' => 'Mode de paiement invalide'];
        }
        if (!$transactionData['success']) {
            return $transactionData;
        }


        // 2. Récupérer le tour et la tontine
        [$tour, $tontine] = $this->recupererTourEtTontine($validatedData['id_tour']);

        // 3. Calculer le montant net
        //[$montantNet, $montantGarantie] = $this->calculerMontantNet($validatedData['montant_cotiser'], $tontine);
        $penaliteService = new \App\Services\PenaliteServices();
        [$montantNet, $montantGarantie] = $penaliteService->calculerMontantNet($validatedData, $tontine, $validatedData['mode_paiement']);
        //$montantNet = ($tontine->montant_a_cotiser);
        // 4. Enregistrer la cotisation et la garantie
        //$cotisation = $this->enregistrerCotisation($validatedData, $montantNet, $transactionData['transaction_id'], $transactionData['status']);
        $cotisation = $this->enregistrerCotisation($validatedData, $tontine->montant_a_cotise, $transactionData['transaction_id'], $transactionData['status']);
        // $transaction = $this->insererGarantie($validatedData, $cotisation, $montantGarantie);
        // 5. Mettre à jour le tour et gérer la distribution
        $this->mettreAJourTourEtDistribution($cotisation, $tour, $tontine, $montantNet, $montantGarantie, $validatedData['mode_paiement']);

        return [
            'success' => true,
            'message' => 'Cotisation insérée avec succès',
            'data' => $cotisation,
            // 'transaction' => $transaction
        ];
    }

    private function recupererTourEtTontine(int $id_tour): array
    {
        $tour = Tour::findOrFail($id_tour);
        $tontine = Tontine::findOrFail($tour->id_tontine);
        return [$tour, $tontine];
    }

    function montant_net_inverse(float $mnt_arrondi, int $nb_participant): array
    {
        // Tester tous les montants possibles avant arrondi
        for ($mnt_possible = $mnt_arrondi - 10; $mnt_possible <= $mnt_arrondi; $mnt_possible += 0.01) {
            // Supposons que c'est le montant juste avant l'arrondi
            // On va essayer de retrouver le net
            for ($net = 0.01; $net < $mnt_possible; $net += 0.01) {
                $garantie = round($net / $nb_participant);
                $mnt_calcule = $net + $garantie + $net * 0.025;
                if (ceil($mnt_calcule / 10) * 10 == $mnt_arrondi) {
                    return [$net, $garantie];
                }
            }
        }
        return [0, 0];
    }

    private function enregistrerCotisation(array $data, float $montantNet, string $transactionId, string $status): Cotisation
    {
        $cotisation = new Cotisation();
        $cotisation->montant_cotise = $montantNet;
        $cotisation->id_tour = $data['id_tour'];
        $cotisation->id_participant = $data['id_participant'];
        $cotisation->numero_paiement = $transactionId;
        $cotisation->statut_paiement_cotisation = $status;
        $cotisation->mode_paiement = $data['mode_paiement'];
        $cotisation->date_cotisation = now();
        $cotisation->save();

        return $cotisation;
    }

    private function mettreAJourTourEtDistribution(Cotisation $cotisation, Tour $tour, Tontine $tontine, float $montantNet, float $montantGarantie, string $modePaiement)
    {
        $tour->montant_distribue += $cotisation->montant_cotise;
        if ($modePaiement === 'assurance') {
            $tontine->montant_cumule += $montantGarantie;
        }

        if ($tour->montant_distribue >= $tontine->montant_total) {
            $participant = $this->recupererBeneficiaire($tour);

            if (!$participant || !isset($participant['utilisateur'])) {
                throw new \Exception('Participant ou utilisateur non trouvé');
            }

            if ($tontine->type_tontine == 'Tontine différée') {
                $this->gererTontineDifferee($tontine, $tour, $montantNet, $participant);
            } else {
                $this->effectuerTransfert($tour, $tontine, $participant);
            }

            $this->envoyerNotifications($tour, $tontine);
            $this->gererFinOuChangementDeTour($tour, $tontine);
            $tour->statut_tour = 'terminé';
        }
        $tour->save();
        $tontine->save();
    }

    private function recupererBeneficiaire(Tour $tour): array
    {
        $request = new Request([
            'numero_ordre' => $tour->numero_tour,
            'id_tontine' => $tour->id_tontine
        ]);
        return (new ParticipantController())->recupererParticipant($request)->getData(true);
    }

    private function gererTontineDifferee(Tontine $tontine, Tour $tour, float $montantNet, array $participant)
    {
        $tontine->montant_cumule += $montantNet;
        if ($tour->numero_tour >= round($tontine->nombre_participants / 2)) {
            $this->effectuerTransfert($tour, $tontine, $participant);
        }
    }

    private function effectuerTransfert(Tour $tour, Tontine $tontine, array $participant)
    {

    $urlFastApi = config('services.url_fast_api');
        $response = Http::post('http://'.$urlFastApi.'/paiement', [
            'numero' => $participant['utilisateur']['telephone'],
            'tontine_id' => intval($tour->id_tontine),
            'tour_id' => intval($tour->id_tour),
            'montant_distribue' => $tour->montant_distribue,
            'montant_total' => $tontine->montant_total
        ]);

        if (!$response->successful()) {
            throw new \Exception('Erreur lors du transfert : ' . $response->body());
        }
    }

    private function envoyerNotifications(Tour $tour, Tontine $tontine)
    {
        $participants = Participant::where('id_tontine', $tour->id_tontine)->get();
        foreach ($participants as $participant) {
            Notification::create([
                'id_utilisateur' => $participant->id_utilisateur,
                'titre' => "Rappel Tontine",
                'description_notification' => $tour->numero_tour == $tontine->nombre_participants
                    ? "La tontine {$tontine->nom_tontine} est terminée."
                    : "Le tour N°{$tour->numero_tour} de la tontine {$tontine->nom_tontine} est terminé.",
                'id_tontine' => $tontine->id_tontine,
                'date_creation' => now(),
                'lu' => false,
                'type_notification' => 'rappel_tontine',
            ]);
        }
    }

    private function gererFinOuChangementDeTour(Tour $tour, Tontine $tontine)
    {
        if ($tour->numero_tour == $tontine->nombre_participants) {
            $tontine->statut_tontine = 'terminé';
        } else {
            $controller = new TourController();
            $donnees_tour = new Request([
                'id_tontine' => $tour->id_tontine,
                'montant_distribue' => $tour->montant_distribue,
                'numero_tour' => $tour->numero_tour,
                'date_debut_tour' => $tour->date_debut_tour,
                'date_fin_tour' => $tour->date_fin_tour,
            ]);

            $result = $controller->changerDeTour($donnees_tour, $tour->id_tontine);
            if ($result->getStatusCode() !== 200) {
                throw new \Exception('Erreur lors du changement de tour');
            }
        }
    }


}