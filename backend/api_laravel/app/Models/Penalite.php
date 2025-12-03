<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penalite extends Model
{
    protected $fillable = ['id_penalite','montant_penalite','motif','statut_penalite','date_penalite', 'id_tour', 'id_participant'];
    protected $table = 'penalite';
    protected $primaryKey = 'id_penalite';

    public function participant() {
        return $this->belongsTo(Participant::class, 'id_participant');
    }

    public function tour() {
        return $this->belongsTo(Tour::class, 'id_tour');
    }
}
