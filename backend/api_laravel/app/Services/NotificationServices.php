<?php

namespace App\Services;

use App\Models\Tour;
use App\Models\Tontine;
use App\Models\Participant;
use App\Models\Penalite;
use App\Models\Cotisation;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;


class NotificationServices
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

    public function createNotification($id_utilisateur, $description, $id_tontine)
    {
        $notification=Notification::create([
            'id_utilisateur' => $id_utilisateur,
            'titre' => "Information Tontine",
            'description_notification' => $description,
            'id_tontine' => $id_tontine,
            'date_creation' => now(),
            'lu' => false,
            'type_notification' => 'info_tontine',
        ]);
        return response()->json([
            'notification' => $notification
        ]);
    }
}