<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penalite;
use Illuminate\Http\Request;
use App\Services\PenaliteServices;
use App\Services\AssuranceServices;


class PenaliteController extends Controller
{
    //
    public function index()
    {
        $penalite = Penalite::with('participant')->get();
        return response()->json([
            'penalite' => $penalite
        ]);
    }

    public function penalites()
    {
        $services = new PenaliteServices();
        $result = $services->penalite();
        echo $result;
    }

    public function assurances()
    {
        $services = new AssuranceServices();
        $result = $services->assurance();
        echo $result;
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $penalite = Penalite::with('participant')->find($id);
        return response()->json([
            'penalite' => $penalite
        ]);
    }

}
