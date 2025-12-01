<?php

namespace App\Services;

use App\Models\Tour;
use App\Models\Tontine;
use App\Models\Participant;
use App\Models\Penalite;
use App\Models\Cotisation;
use App\Models\Notification;
use App\Services\NotificationServices;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TourServices
{
    public function addFirstTour($id_tontine)
    {
        $notificationsServices = new NotificationServices();
        $tontine = Tontine::where('id_tontine', $id_tontine)->first();
        $nom_tontine = $tontine->nom_tontine;
        switch ($tontine['frequence']) {
            case 'Mensuelle':
                $date_fin = now()->addDays(30);
                break;
            case 'Hebdomadaire':
                $date_fin = now()->addDays(7);
                break;
            case 'Quizaine':
                $date_fin = now()->addDays(15);
                break;
            case 'Deux mois':
                $date_fin = now()->addDays(60);
                break;
            case 'Trimestrielle':
                $date_fin = now()->addDays(90);
                break;
            default:
                $date_fin = now()->addMinutes(15);
                break;
        }
        $tour = Tour::create([
            'numero_tour' => 1,
            'date_debut_tour' => now(),
            'date_fin_tour' => $date_fin,
            'montant_distribue' => 0,
            'statut_tour' => 'actif',
            'id_tontine' => $id_tontine
        ]);
        // $tontine->statut_tontine='En cours';
        // $tontine->save();
        $tontine->update(['statut_tontine' => 'En cours']);
        $participants = \App\Models\Participant::where('id_tontine', $id_tontine)->get();
        foreach ($participants as $participant) {
            // Logique pour envoyer notification
            $id_utilisateur = $participant->id_utilisateur;
            $description = "Le tour N°1 de la tontine " . $nom_tontine . " a débuté.";
            $notif = $notificationsServices->createNotification($id_utilisateur, $description, $id_tontine);
        }

        return response()->json([
            'tour' => $tour,
            'tontine' => $tontine
        ]);
    }
}