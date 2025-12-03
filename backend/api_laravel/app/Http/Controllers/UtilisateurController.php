<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Http\Controllers;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{

    public function inscription(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'telephone' => 'required|regex:/^\+?[0-9]+$/',
            'date_de_naissance' => 'nullable|date',
            'id' => 'nullable|integer',
        ]);

        Utilisateur::create([
            'nom' => $request->nom,
            'pseudo' => $request->nom,
            'prenoms' => $request->prenom,
            'telephone' => $request->telephone,
            'contact' => $request->telephone,
            'date_inscription' => now(),
            'actif' => true,
            'date_de_naissance' => $request->date_de_naissance,
            'maxitId' => $request->id,
        ]);
        return response()->json(['message' => 'Inscription réussie'], 200);
    }

    public function login(string $id)
    {
        // Rechercher l'utilisateur par pseudo OU par contact
        $utilisateur = Utilisateur::where('maxitId', $id)->first();

        if ($utilisateur) {
            return response()->json([
                'message' => 'compte existant',
                'utilisateur' => $utilisateur,
                'success' => true
            ]);
        } else {
            return response()->json([
                'message' => 'compte inexistant',
                'success' => false
            ]);
        }

    }

}