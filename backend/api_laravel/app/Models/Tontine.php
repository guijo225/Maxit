<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tontine extends Model

{
    protected $primaryKey = 'id_tontine';
    protected $fillable = ['id_tontine', 'nom_tontine', 'montant_a_cotise', 'montant_total', 'nombre_participants','statut_tontine', 'montant_cumule', 'updated_at'];
    protected $table = 'tontine';


    public function participant() {
        return $this->hasMany(Participant::class, 'id_tontine');
    }

    public function tour() {
        return $this->hasMany(Tour::class, 'id_tontine');
    }

    public function notification() {
        return $this->hasMany(Notification::class, 'id_notification');
    }

    public function utilisateur() {
        return $this->belongsToMany(Utilisateur::class);
    }
}
