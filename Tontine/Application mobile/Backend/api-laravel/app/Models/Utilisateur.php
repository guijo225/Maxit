<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    use HasFactory;

    protected $table = 'utilisateur';

    public $timestamps = false;

    public $incrementing = false;

    public $primaryKey ='id_utilisateur';


    protected $fillable = [
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
}
