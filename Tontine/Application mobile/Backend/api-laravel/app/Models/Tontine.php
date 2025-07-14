<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tontine extends Model
{
    use HasFactory;

    protected $table = 'tontine';
    protected $primaryKey = 'id_tontine';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'nom_tontine',
        'description_tontine',
        'regles',
        'motant_a_cotise',
        'montant_total',
        'nombre_participants',
        'statut_tontine',
        'date_creation',
        'date_debut',
        'date_echeance'
    ];

}
