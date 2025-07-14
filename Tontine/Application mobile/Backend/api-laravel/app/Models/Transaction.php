<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tour;
use App\Models\Paticipant;

class Transaction extends Model
{
    use HasFactory;
    protected $table = 'transaction';
    protected $primaryKey = 'id_transaction';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'id_tour',
        'id_participant',
        'montant_transaction',
        'date_transaction',
        'type_transaction',
        'numero_transaction',
        'statut_transaction',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class, 'id_tour');
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class, 'id_participant');
    }
}