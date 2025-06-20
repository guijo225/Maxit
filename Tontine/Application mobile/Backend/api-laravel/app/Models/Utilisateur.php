<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    use HasFactory;

    protected $table = 'utilisateurs';

    public $timestamps = false;

    public $incrementing = false;


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
}
