<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\Tontine;
use Illuminate\Http\Request;
use App\Services\TourServices;


class TourController extends Controller
{
    public function changerDeTour(Request $request, string $id)
    {
        // Logique pour changer de tour
        $tour = Tour::where('id_tontine', $id)->orderBy('numero_tour', 'desc')->first();
        if (!$tour) {
            return response()->json(['message' => 'Tour non trouvé'], 404);
        }
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
    public function ajouter($id_tontine)
    {
        $services = new TourServices;
        $result = $services->addFirstTour($id_tontine);
        echo $result;
    }


    /**
     * Display the specified resource.
     */
    public function show(int $id_tontine)
    {
        $tour = Tour::with('cotisation')->where('id_tontine', $id_tontine)->orderBy('numero_tour', 'desc')->get();
        return response()->json([
            'tour' => $tour,
        ], 200);
    }

}
