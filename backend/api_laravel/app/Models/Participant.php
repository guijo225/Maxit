<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_utilisateur',
        'tontine_id',
        'numero_ordre',
        'date_adhesion',
        'a_recu_paiement'
    ];
    protected $table = 'participant';
    protected $primaryKey = 'id_participant';
    public $timestamps = false;
    public $incrementing = false;

    public function tontine() {
        return $this->belongsTo(Tontine::class,'id_tontine');
    }

    public function penalite() {
        return $this->hasMany(Penalite::class, 'id_participant');
    }

    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class,'id_utilisateur');
    }

    public function cotisation() {
        return $this->hasMany(Cotisation::class,'id_participant');
    }

}