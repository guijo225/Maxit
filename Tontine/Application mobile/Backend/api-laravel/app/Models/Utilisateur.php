<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Tontine;

class Utilisateur extends Authenticatable implements JWTSubject
{
    use Notifiable, HasFactory;

    protected $table = 'utilisateur';

    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'id_utilisateur'; // ← à adapter selon ta table
    protected $keyType = 'string'; // ← si c'est un UUID ou autre que int

    protected $fillable = [
        'nom',
        'prenoms',
        'pseudo',
        'date_de_naissance',
        'contact',
        'date_inscription',
        'mot_de_passe',
        'photo'
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function tontines()
    {
        return $this->belongsToMany(Tontine::class, 'participant', 'id_utilisateur', 'id_tontine');
    }

}

