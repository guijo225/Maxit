<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participant;

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
}
