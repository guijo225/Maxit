<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tour;

class TourController extends Controller
{
    //
    public function afficheTour(string $id)
    {
        // Logique pour afficher les détails du tour
        $tour = Tour::where('id_tontine', $id)->orderBy('numero_tour', 'asc')->get();
        if (!$tour) {
            return response()->json(['message' => 'Tour non trouvé'], 404);
        }

        return response()->json($tour, 200);
    }

    public function changerDeTour(Request $request, string $id)
    {
        // Logique pour changer de tour
        $tour = Tour::where('id_tontine', $id)->orderBy('numero_tour', 'desc')->first();
        if (!$tour) {
            return response()->json(['message' => 'Tour non trouvé'], 404);
        }


        $tour->statut_tour = 'terminé';
        $tour->save();


        $newTour = new Tour();
        $newTour->id_tontine = $id;
        $newTour->numero_tour = $tour->numero_tour + 1;
        $newTour->date_debut_tour = now();
        $newTour->date_fin_tour = now()->addDays(30);
        $newTour->montant_distribue = 0;
        $newTour->statut_tour = 'en cours';
        $newTour->save();

        return response()->json(['message' => 'Tour changé avec succès', 'nouveau_tour' => $newTour], 200);
    }


}