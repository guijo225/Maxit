<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;
    protected $table = 'participant';

    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'tontine_id',
        'numero_ordre',
        'date_adhesion',
        'a_recu_paiement'
    ];
}
