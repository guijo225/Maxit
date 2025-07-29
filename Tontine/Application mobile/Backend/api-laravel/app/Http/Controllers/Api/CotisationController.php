<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CotisationController extends Controller
{
    //
    public function insererCotisation(Request $request)
    {
        $validatedData = $request->validate([
            'montant_cotise' => 'required|numeric',
            'id_tour' => 'required|exists:tour,id_tour',
            'id_participant' => 'required|exists:participant,id_participant',
            'telephone' => 'required|string',
        ]);

        $tontineService = new \App\Services\TontineService();
        $result = $tontineService->insererCotisation($validatedData);

        if (!$result['success']) {
            return response()->json(['error' => $result['message'], 'details' => $result['details'] ?? null], 500);
        }

        return response()->json(['message' => $result['message'], 'data' => $result['data']], 201);
    }

}