<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $table = 'tour';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'id_tour';

    protected $fillable = [
        'id_tontine',
        'date_debut_tour',
        'date_fin_tour',
        'numero_tour',
        'montant_distribue',
        'statut_tour'
    ];
}
