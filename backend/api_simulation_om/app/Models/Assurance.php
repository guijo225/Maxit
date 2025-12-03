<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assurance extends Model
{
    //
    use HasFactory;
    protected $table = 'assurance_transaction';
    public $incrementing = false;

    protected $fillable = [
        'id_participant',
        'id_tour',
        'montant',
        'statut',
        'transaction_id',
        'phone',
    ];
    public $timestamps = false;

}
