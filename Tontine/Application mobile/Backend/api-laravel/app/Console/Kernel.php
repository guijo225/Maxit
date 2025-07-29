<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Notification;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {

        // $schedule->command('inspire')->hourly();
        $schedule->call(function () {
        $today = \Carbon\Carbon::today();

        //recuperer les tour de toutes les tontines dont la date de rappel est aujourd'hui
        //$Tour = \App\Models\Tour::whereDate('date_fin_tour', $today)->where('statut_tour', 'en cours')->get();
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
                        ]);}
                        
                    }
                }
            
        }

        })->daily('09:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
