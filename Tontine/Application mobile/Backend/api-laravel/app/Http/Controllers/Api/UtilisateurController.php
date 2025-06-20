<?php

namespace App\Http\Controllers\Api;

use App\Models\Utilisateur;
use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    //
    public function inscription(Request $request)
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
    }
    public function login(Request $request)
    {
        $request->validate([
            'identifiant' => 'required', // pseudo ou contact
            'mot_de_passe' => 'required|string',
        ]);

        // Rechercher l'utilisateur par pseudo OU par contact
        $utilisateur = Utilisateur::where('pseudo', $request->identifiant)
            ->orWhere('contact', $request->identifiant)
            ->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Identifiant ou mot de passe incorrect'], 401);
        }

        // Générer un token simple
        $token = base64_encode(random_bytes(40));

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $utilisateur,
            'token' => $token
        ]);
    }

}
