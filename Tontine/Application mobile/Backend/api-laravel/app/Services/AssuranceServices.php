<?php

namespace App\Services;

use App\Http\Controllers\PenaliteController;
use App\Models\Tour;
use App\Models\Tontine;
use App\Models\Participant;
use App\Models\Penalite;
use App\Models\Cotisation;
use App\Services\CreerPenaliteServices;
use App\Services\NotificationServices;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

const POURCENTAGE_PENALITE = 0.01;
const CONTACT_ASSURANCE = '+2250700000000';

class AssuranceServices
{

    public function assurance()
    {
        \Log::info('Début du traitement pour l\'assurance');
        $penaliteServices = new CreerPenaliteServices();
        $notificationsServices = new NotificationServices();

        $tontines = Tontine::where('statut_tontine', 'en cours')->where('type_tontine', 'Tontine avec assurance')->get();
        $penalitesTraitees = 0;

        foreach ($tontines as $tontine) {
            $id_tontine = $tontine->id_tontine;
            $garantie = $tontine->montant_cumule;
            $montant_a_cotise = $tontine->montant_a_cotise;
            $nom_tontine = $tontine->nom_tontine;

            // Récupérer le dernier tour pour cette tontine
            $tour = Tour::where('id_tontine', $id_tontine)->where('date_fin_tour', '>=', today())->where('statut_tour', 'en cours')->first();

            if ($tour) {
                //$allTours[$id_tontine] = $tour; // Stocker le tour par id_tontine
                $id_tour = $tour->id_tour;

                // Récupérer tous les participants pour cette tontine
                $participants = Participant::where('id_tontine', $id_tontine)->get();
                //$allParticipants[$id_tontine] = $participants; // Stocker les participants par id_tontine

                // Préparer un tableau pour les cotisations de ce tour/tontine
                //$allCotisations[$id_tour] = [];

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
                    $montant_a_paye = count($participantsPenalises) * $montant_a_cotise;

                    if ($montant_a_paye <= $garantie) {
                        //$nouvelleGarantie = $garantie;
                        foreach ($participantsPenalises as $id_penalises) {
                            $participant = Participant::where('id_participant', $id_penalises)->with('utilisateur')->first();
                            if ($participant && $participant->utilisateur) {
                                $id_utilisateur = $participant->id_utilisateur;
                                $nom_utilisateur = $participant->utilisateur->prenom;
                            } else {
                                return "Aucun participant trouvé";
                            }
                            try {
                                $response = Http::post('http://192.168.252.228:8000/api/insererCotisation', [
                                    "montant_cotise" => $montant_a_cotise,
                                    "id_tour" => $id_tour,
                                    "id_participant" => $id_penalises,
                                    "telephone" => CONTACT_ASSURANCE,
                                    "mode_paiement" => "assurance"
                                ]);
                                if (!$response->successful()) {
                                    return ("Erreur API : " . $response);
                                }

                                $montant = $montant_a_cotise * POURCENTAGE_PENALITE;
                                $penaliteServices->createPenalites($montant, $id_tour, $id_penalises);

                                $description = "L'assurance a payé votre cotisation, vous devrez la rembourser au prochain tour et payer une pénalité pour retard de paiement dans la tontine {$nom_tontine}.";
                                $notificationsServices->createNotification($id_utilisateur, $description, $id_tontine);

                                $tontine->decrement('montant_cumule', $montant_a_cotise);
                                $penalitesTraitees++;
                            } catch (\Exception $e) {
                                $err = "Erreur : " . $e->getMessage() . " dans " . $e->getFile() . " à la ligne " . $e->getLine();
                                return $err;
                            }
                        }
                    } else {
                        foreach ($participantsPenalises as $id_penalises) {
                            $penalites = Penalite::where('id_tour', $id_tour)->where('id_participant', $id_penalises)->where('statut_penalite', 'Impayée')->first();
                            if (!$penalites) {
                                $montant = $montant_a_cotise * POURCENTAGE_PENALITE;
                                $penalite = $penaliteServices->createPenalites($montant, $id_tour, $id_penalises);
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
        }
        \Log::info("Traitement des tontines avec assurances terminé. $penalitesTraitees pénalités ont été traitées ou mises à jour.");
        //return Command::SUCCESS;
        return response()->json([
            'id_tontine' => $id_tontine ?? null,
            'tontine' => $tontines ?? null,
            'penalite' => $penalite ?? null,
            'notif' => $notif ?? null,
            'erreur' => $err ?? null,
            'tour' => $tour ?? null,
            'paticiAcotise' => $participantAyantCotise ?? null,
            'particTontin' => $participantIds ?? null,
        ]);
    }
}