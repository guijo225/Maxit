<?php

namespace App\Services;

use App\Models\Tour;
use App\Models\Tontine;
use App\Models\Participant;
use App\Models\Penalite;
use App\Models\Cotisation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CreerPenaliteServices
{
    public function createPenalites($montant, $id_tour, $id_participant)
    {
        $penalite = Penalite::create([
            'montant_penalite' => $montant,
            'motif' => 'Retard de paiement de cotisation',
            'date_penalite' => now(),
            'statut_penalite' => 'Impayée',
            'id_tour' => $id_tour,
            'id_participant' => $id_participant,
            'updated_at' => now()
        ]);
        return response()->json([
            'penalite' => $penalite
        ]);
    }
}