<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notification;

class CommandeRappelsDateEcheance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:commande-rappels-date-echeance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //recuperer les tour de toutes les tontines dont la date de rappel est aujourd'hui
        $tontine = \App\Models\Tontine::where('statut_tontine', 'en cours')->get();
        foreach ($tontine as $tont) {
            //recuperer le tour en cours de la tontine
            $tour = \App\Models\Tour::where('id_tontine', $tont->id_tontine)
                ->where('statut_tour', 'en cours')
                ->first();

            if ($tour) {
                //verifier si la date de rappel du tour est aujourd'hui
                switch ($tont->date_echeance) {
                    case '1 jour':
                        $dateRappel = $tour->date_fin_tour->copy()->subDay();
                        $jour = '1 jour';
                        break;
                    case '2 jours':
                        $dateRappel = $tour->date_fin_tour->copy()->subDays(2);
                        $jour = '2 jour';
                        break;
                    case '3 jours':
                        $dateRappel = $tour->date_fin_tour->copy()->subDays(3);
                        $jour = '3 jour';
                        break;
                    case '4 jours':
                        $dateRappel = $tour->date_fin_tour->copy()->subDays(4);
                        $jour = '4 jour';
                        break;
                    case '5 jours':
                        $dateRappel = $tour->date_fin_tour->copy()->subDays(5);
                        $jour = '5 jour';
                        break;
                    default:
                        break;
                }
            }

            if ($dateRappel->isToday()) {
                //envoyer notification aux participants de la tontine qui ont pas encore payé
                //recuperer les participants de la tontine
                $participants = \App\Models\Participant::where('id_tontine', $tont->id_tontine)->get();
                foreach ($participants as $participant) {
                    //verifier si le participant a deja payé
                    $cotisation = \App\Models\Cotisation::where('id_participant', $participant->id_participant)
                        ->where('id_tour', $tour->id_tour)
                        ->first();
                    if (!$cotisation) {
                        // Logique pour envoyer notification
                    Notification::create([
                        'id_utilisateur' => $participant->id_utilisateur,
                        'titre' => "Rappel Tontine",
                        'description_notification' => "Le tour de la tontine " . $tont->nom_tontine . " se termine dans " . $jour . " .",
                        'id_tontine' => $tont->id_tontine,
                        'date_creation' => now(),
                        'lu' => false,
                        'type_notification' => 'rappel_tontine',
                    ]);
                    }
                }
            }
        }
    }
}
