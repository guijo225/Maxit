<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assurance_transaction extends Model
{
    use HasFactory;
    protected $table = 'assurance_transaction';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'transaction_id',
        'montant',
        'statut',
    ];
    public $timestamps = false;
}
