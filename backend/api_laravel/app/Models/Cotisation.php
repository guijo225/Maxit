<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cotisation extends Model
{
    protected $fillable = ['montant_cotise', 'date_cotisation', 'mode_paiement', 'statut_paiement_cotisation', 'id_tour', 'id_utilisateur', 'id_participant'];
    protected $primaryKey = 'id_cotisation';
    protected $table = 'cotisation';
    public $incrementing = false;
    public $timestamps = false;
    
    public function tour() {
        return $this->belongsTo(Tour::class, 'id_tour');
    }

    public function participant() {
        return $this->belongsTo(Participant::class, 'id_participant');
    }
}
