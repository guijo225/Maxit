<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;


use Illuminate\Http\Request;
use App\Models\Participant;
use App\Models\Utilisateur;

class ParticipantController extends Controller
{
    //
    public function participantTontine(string $id)
    {
        $participants = Participant::where('id_tontine', $id)->get();
        if ($participants->isEmpty()) {
            return response()->json(['message' => 'Aucun participant trouvé pour cette tontine.'], 404);
        }
        return response()->json($participants, 200);

    }

    public function modiferOrdre(request $request, string $id_participant)
    {
        // Logique pour modifier l'ordre du participant
        $participant = Participant::find($id_participant);
        if (!$participant) {
            return response()->json(['message' => 'Participant non trouvé'], 404);
        }

        // Mettre à jour l'ordre du participant
        $participant->ordre = $request->ordre;
        $participant->save();

        return response()->json(['message' => 'Ordre du participant modifié avec succès', 'participant' => $participant], 200);

    }

    public function participantQuiRecupere(string $numero_tour)
    {
        // Logique pour afficher les participants qui ont récupéré leur cotisation
        $participants = Participant::where('numero_ordre', $numero_tour)->get();

        if ($participants->isEmpty()) {
            return response()->json(['message' => 'Aucun participant trouver pour ce tour.'], 404);
        }

        return response()->json($participants, 200);
    }

    Public function updateOrdre(request $request){
        foreach ($request->all() as $user){
            Participant::where('id_participant', $user['id'])->update(['numero_ordre' => $user['ordre']]);
        }
    }
}
