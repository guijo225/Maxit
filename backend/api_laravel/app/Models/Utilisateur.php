<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    protected $primaryKey = 'id_utilisateur';
    public $timestamps = false;
    public $incrementing = false;

    protected $table = 'utilisateur';protected $fillable = [
        'nom',
        'prenoms',
        'pseudo',
        'date_de_naissance',
        'contact',
        'telephone',
        'maxitId',
        'date_inscription',
        'actif'
    ];
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    public function Participant() {
        return $this->hasMany(Participant::class, 'id_participant');
    }

    public function notification() {
        return $this->hasMany(Notification::class, 'id_notification');
    }

    public function tontine() {
        return $this->belongsToMany(Tontine::class, 'id_participant');
    }
}
