<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\models\Tour;
use App\models\utilisateur;

class Participant extends Model
{
    use HasFactory;
    protected $table = 'participant';
    protected $primaryKey = 'id_participant';

    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id_utilisateur',
        'tontine_id',
        'numero_ordre',
        'date_adhesion',
        'a_recu_paiement'
    ];

    public function tour(){
        return $this->belongsTo(Tour::class, 'id_tour');
    }

    public function utilisateur(){
        return $this->belongsTo(utilisateur::class, 'id_utilisateur');
    }
}
