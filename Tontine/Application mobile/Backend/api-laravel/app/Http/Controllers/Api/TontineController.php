<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use App\Models\Tontine;

class TontineController extends Controller
{
    //renvoyer les informations d'une tontine
    public function afficheTontine(string $id)
    {
        // Logique pour afficher les détails de la tontine
        $tontine = Tontine::find($id);
        if (!$tontine) {
            return response()->json(['message' => 'Tontine non trouvée'], 404);
        }

        return response()->json($tontine, 200);
    }

    //liste des tontines pour un utilisateur

    /*public function TontinesParUtilisateur($id_utilisateur)
    {
        $tontines = DB::table('tontine')
            ->join('participant', 'tontine.id_tontine', '=', 'participant.id_tontine')
            ->where('participant.id_utilisateur', $id_utilisateur)
            ->select('tontine.*')
            ->get();

        return response()->json($tontines);
    }*/

}
