<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\CommandeCalculePenalite;
use App\Console\Commands\CommandeAssurances;
use App\Console\Commands\CommandeRappelsDateEcheance;

Schedule::command('app:commande-calcule-penalite')->everyMinute();
Schedule::command('app:commande-assurances')->everyMinute();
Schedule::command('app:commande-rappels-date-echeance')->daily('09:00');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
