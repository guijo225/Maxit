<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CotisationController extends Controller
{
    //
    public function insererCotisation(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'montant_cotise' => 'required|numeric',
                'id_tour' => 'required|integer',
                'id_participant' => 'integer',
                'telephone' => 'required|string',
                'mode_paiement' => 'required|string',
            ]);


            $tontineService = new \App\Services\TontineService();
            $result = $tontineService->insererCotisation($validatedData);

            if (!$result['success']) {
                return response()->json(['error' => $result['message'], 'details' => $result['details'] ?? null], 500);
            }
            return response()->json(['data' => $validatedData], 201);

        } catch (\Exception $e) {
            return response()->json([
                'erreur' => $e->getMessage(),
                'fichier' => $e->getFile(),
                'ligne' => $e->getLine()
            ], 500);
        }

        // return response()->json(['message' => $result['message'], 'data' => $result['data']], 201);
    }

}