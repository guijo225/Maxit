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
        'prenom',
        'pseudo',
        'date_naissance',
        'contact',
        'date_inscription',
        'password',
        'photo_piece_identite'
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
}
