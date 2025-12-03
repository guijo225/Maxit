<?php

namespace App\Http\Controllers;

use App\Models\Tontine;
use Illuminate\Http\Request;

class TontineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tontine = Tontine::with('participant')->get();
        return response()->json([
            'tontine' => $tontine
        ]);
    }
    
    public function show(int $id)
    {
        try{
            $tontine = Tontine::with([
                'tour'=> function ($query) {
                    $query->orderBy('numero_tour', 'desc');
                },
                'tour.cotisation',
                'participant'=> function ($query) {
                    $query->orderBy('numero_ordre', 'asc');
                },
                'participant.utilisateur',
                'participant.penalite',
                'participant.cotisation'
                ])->find($id);
            return response()->json([
                'tontine' => $tontine
            ],200);
            }catch(\Exception $e){
                return response()->json([
                'tontine' => null,
                'error' => $e->getMessage()
                ],500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function dernierTour(int $id)
    {
        $tontine = Tontine::findOrFail($id);

        $dernierTour = Tour::where('id_tontine', $id)->latest('created_at')->first();

        if (!$dernierTour) {
            return response()->json(['message' => 'Aucun tour trouvé pour cette tontine'], 404);
        }

        return response()->json([
            'tontine' => $tontine,
            'dernier_tour' => $dernierTour
        ]);
    }

    //
    public function afficheTontine(string $id)
    {
        // Logique pour afficher les détails de la tontine
        $tontine = Tontine::find($id);
        if (!$tontine) {
            return response()->json(['message' => 'Tontine non trouvée'], 404);
        }

        return response()->json($tontine, 200);
    }

    public function afficherReglementTontine(string $id)
    {
        // Logique pour afficher le règlement de la tontine
        $tontine = Tontine::find($id);
        if (!$tontine) {
            return response()->json(['message' => 'Tontine non trouvée'], 404);
        }

        return response()->json(['reglement' => $tontine->regles], 200);
    }


}
