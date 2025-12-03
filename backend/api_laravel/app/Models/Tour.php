<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    protected $fillable = [
        'numero_tour',
        'date_debut_tour',
        'date_fin_tour',
        'montant_distribue',
        'statut_tour',
        'id_tontine'
    ];
    protected $primaryKey = 'id_tour';
    protected $table = 'tour';
    public $timestamps = false;
    public $incrementing = false;


    public function tontine() {
        return $this->belongsTo(Tontine::class, 'id_tontine');
    }

    public function cotisation(){
        return $this->hasMany(Cotisation::class, 'id_tour');
    }

    public function penalite(){
        return $this->hasMany(Penalite::class, 'id_tour');
    }
}
