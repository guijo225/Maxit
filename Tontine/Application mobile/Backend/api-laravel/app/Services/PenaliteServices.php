<?php

namespace App\Services;

use App\Models\Tontine;
use App\Models\Transaction;

use App\Models\Tour;
use App\Models\Participant;
use App\Models\Penalite;
use App\Models\Cotisation;
use Carbon\Carbon;

class PenaliteServices
{
    public function calculerMontantNet(array $data, Tontine $tontine, string $status): array
    {
        if ($tontine->type_tontine == 'Tontine avec assurance') {

            $mntDivers = $data['montant_cotise'] - $tontine->montant_a_cotise; // Extractions du montant en plus 
            $montant = $mntDivers - ceil(($tontine->montant_a_cotise / $tontine->nombre_participants) / 5) * 5; //Commissions
            $montantGarantie = $mntDivers - $montant;
            //Montant de la garantie 
            $montantGarantie = $data['montant_cotise'] / $tontine->nombre_participants;
            if ($status !== 'assurance') {
                Transaction::create([
                    'numero_transaction' => uniqid(),
                    'type_transaction' => 'garantie',
                    'montant_transaction' => $montantGarantie,
                    'date_transaction' => now(),
                    'statut_transaction' => 'succès',
                    'id_participant' => $data['id_participant'],
                    'id_tour' => $data['id_tour']
                ]);
            }
            $montantNet = ($data['montant_cotise'] - $montantGarantie) / 1.025; // Je commente parce qu'on a déjà le résultat qui est égale au montant à cotisé qui vient de la bd
            $montantNet = $tontine->montant_a_cotise;
            return [$montantNet, $montantGarantie];
            //return [$montantGarantie];
        }

        // Cas sans assurance
        $montantNet = $data['montant_cotise'] / 1.025;
        $montantGarantie = 0;
        return [$montantNet, $montantGarantie];
    }

    public function penalite()
    {
        $tontines = Tontine::where('statut_tontine', 'en cours')->get();
        $allTours = [];
        $allParticipants = [];
        $allCotisations = [];

        foreach ($tontines as $tontine) {
            $id_tontine = $tontine->id_tontine;
            $montant_a_cotise = $tontine->montant_a_cotise;

            // Récupérer le dernier tour pour cette tontine
            // $tour = Tour::where('id_tontine', $id_tontine)->where('date_fin_tour', today())->latest()->first();
            $tour = Tour::where('id_tontine', $id_tontine)->where('date_fin_tour', today())->first();
            if ($tour) {
                $allTours[$id_tontine] = $tour; // Stocker le tour par id_tontine
                $id_tour = $tour->id_tour;

                // Récupérer tous les participants pour cette tontine
                $participants = Participant::where('id_tontine', $id_tontine)->get();
                $allParticipants[$id_tontine] = $participants; // Stocker les participants par id_tontine

                // Préparer un tableau pour les cotisations de ce tour/tontine
                $allCotisations[$id_tour] = [];

                // Récupérer toutes les cotisations pour ce tour et ces participants en une seule requête (ou moins)
                // en utilisant 'whereIn' pour les IDs des participants
                $participantIds = $participants->pluck('id_participant')->toArray();

                if (!empty($participantIds)) {
                    $cotisations = Cotisation::where('id_tour', $id_tour)
                        ->whereIn('id_participant', $participantIds)
                        ->get();
                    $participantAyantCotise = $cotisations->pluck('id_participant')->toArray();
                    // Organiser les cotisations par id_participant
                    foreach ($cotisations as $cotisation) {
                        // Initialiser le tableau si nécessaire
                        if (!isset($allCotisations[$id_tour][$cotisation->id_participant])) {
                            $allCotisations[$id_tour][$cotisation->id_participant] = [];
                        }
                        $allCotisations[$id_tour][$cotisation->id_participant][] = $cotisation;
                    }

                    $participantsPenalises = array_diff($participantIds, $participantAyantCotise);

                    foreach ($participantsPenalises as $id_penalises) {

                        $penalites = Penalite::where('id_tour', $id_tour)->where('id_participant', $id_penalises)->where('statut_penalite', 'Impayée')->first();
                        if (!$penalites) {
                            $mnt = $montant_a_cotise * POURCENTAGE_PENALITE;
                            $penalite = Penalite::create([
                                'montant_penalite' => $mnt,
                                'motif' => 'Retard de paiement de cotisation',
                                'date_penalite' => now(),
                                'statut_penalite' => 'Impayée',
                                'id_tour' => $id_tour,
                                'id_participant' => $id_penalises,
                                'updated_at' => now()
                            ]);
                            $penalitesEnregistrees[] = $penalite;
                        } else {
                            $dateDernierCalcul = Carbon::parse($penalites->updated_at);
                            $joursPasses = $dateDernierCalcul->diffInDays(now());
                            if ($joursPasses > 0) {
                                $ajoutMntPenalite = $montant_a_cotise * POURCENTAGE_PENALITE;
                                $montantAjoute = $penalites->montant_penalite + ($ajoutMntPenalite * $joursPasses);
                                $montantAjoute = round($montantAjoute / 5) * 5;
                                $penalites->update([
                                    'montant_penalite' => $montantAjoute
                                ]);
                                $penalitesEnregistrees[] = $penalites;
                            }
                        }
                    }
                }
            }
        }
        return response()->json([
            'id_tontine' => $id_tontine,
            'tontine' => $tontines,
            'tour' => $allTours,
            'participant' => $allParticipants,
            'cotisation' => $allCotisations,
            'penalites_enregistrees' => $penalitesEnregistrees
        ]);
    }

}