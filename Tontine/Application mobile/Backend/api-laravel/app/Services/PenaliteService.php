<?php

namespace App\Services;

use App\Models\Tontine;
use App\Models\Transaction;

class PenaliteService
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
}