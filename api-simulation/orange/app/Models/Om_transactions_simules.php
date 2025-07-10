<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Om_transactions_simules extends Model
{
    use HasFactory;
    protected $table = 'om_transactions_simules';
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
