<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tour;
use App\Models\Participant;

class Cotisation extends Model
{
    use HasFactory;

    protected $table = 'cotisation';
    protected $primaryKey ='id_cotisation';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'montant_cotisation',
        'date_cotisation',
        'mode_paiement',
        'statut_paiement_cotisation',
        'id_tour',
        'id_participant'
    ];


    public function tour(){
        return $this->belongsTo(Tour::class, 'id_tour');
    }

    public function participant(){
        return $this->belongsTo(Participant::class, 'id_participant');
    }


}
