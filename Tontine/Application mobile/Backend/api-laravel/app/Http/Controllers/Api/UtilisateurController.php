<?php

namespace App\Http\Controllers\Api;

use App\Models\Utilisateur;
use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    //
    /*public function inscription(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenoms' => 'required|string',
            'pseudo' => 'required|string',
            'date_de_naissance' => 'nullable|string',
            'contact' => 'required|numeric',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'mot_de_passe' => 'required|string|min:6',
        ]);

        // Vérifier si le pseudo existe deja
        if (Utilisateur::where('pseudo', $request->pseudo)->exists()) {

            return response()->json(['message' => 'Un compte avec ce pseudo existe déjà'], 409);
        } else if (Utilisateur::where('contact', $request->contact)->exists()) {
            return response()->json(['message' => 'Un compte avec ce contact existe déjà'], 409);
        } else {
            // Vérifier si la date de naissance est valide
            $date_de_naissance = date('Y-m-d', strtotime($request->date_de_naissance));
            if ($date_de_naissance > date('Y-m-d')) {
                return response()->json(['message' => 'La date de naissance ne peut pas être dans le futur'], 422);
            } else {

                // Enregistrement de l'image de la pièce d'identité si elle est fournie
                if ($request->hasFile('photo')) {
                    $imagePath = $request->file('photo')->store('pieces_identite', 'public');
                } else {
                    $imagePath = null; // Ou une valeur par défaut si nécessaire
                }


                // Créer l'utilisateur
                $utilisateur = Utilisateur::create([
                    'nom' => $request->nom,
                    'prenoms' => $request->prenoms,
                    'pseudo' => $request->pseudo,
                    'date_de_naissance' => $request->date_de_naissance,
                    'contact' => $request->contact,
                    'date_inscription' => date('Y-m-d H:i:s', strtotime('now')),
                    'photo' => $imagePath,
                    'mot_de_passe' => Hash::make($request->mot_de_passe),
                ]);
                //$utilisateur = new Utilisateur();

                return response()->json(['message' => 'Compte créé avec succès'], 201);

            }
        }
    }*/

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

        /*if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Identifiant ou mot de passe incorrect'], 401);
        }*/

        if($utilisateur){
        return response()->json([
            'message' => 'compte existant',
            'utilisateur' => $utilisateur,
            'success' => true
        ]);}else{
            return response()->json([
            'message' => 'compte inexistant',
            'success' => false]);
        }

    }

}