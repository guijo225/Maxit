<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    //
    public function getNotifications(Request $request)
    {
        $validatedData = $request->validate([
            'id_utilisateur' => 'required|exists:utilisateur,id_utilisateur',
        ]);

        $notifications = Notification::where('id_utilisateur', $validatedData['id_utilisateur'])
            ->orderBy('date_creation', 'desc')
            ->get();

        return response()->json(['notifications' => $notifications], 200);
    }


    public function getNotificationsTontine(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'id_utilisateur' => 'required|exists:utilisateur,id_utilisateur',
                'id_tontine' => 'required|exists:tontine,id_tontine',
            ]);

            $notifications = Notification::where('id_utilisateur', $validatedData['id_utilisateur'])
                ->where('id_tontine', $validatedData['id_tontine'])
                ->orderBy('date_creation', 'desc')
                ->get();

            //return response()->json(['notifications' => $notifications], 200);
            return response()->json(['data' => $notifications], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function countNotifications(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'id_utilisateur' => 'required|exists:utilisateur,id_utilisateur',
                'id_tontine' => 'required|exists:tontine,id_tontine',
            ]);

            $count = Notification::where('id_utilisateur', $validatedData['id_utilisateur'])
                ->where('id_tontine', $validatedData['id_tontine'])
                ->where('lu', false)
                ->count();

            return response()->json(['count' => $count], 200);
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
