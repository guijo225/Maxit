<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Participant;
use App\Models\Tontine;
use App\Models\Tour;


class NotificationService
{
    public function envoyerNotifications(Tour $tour, Tontine $tontine)
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
}