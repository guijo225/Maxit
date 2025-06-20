<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tontine;

class TontineController extends Controller
{
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
}
