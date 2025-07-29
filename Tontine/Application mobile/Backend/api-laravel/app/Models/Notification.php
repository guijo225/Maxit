<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $table = 'notification';
    protected $primaryKey = 'id_notification';
    public $timestamps = false;

    protected $fillable = [
        'id_tontine',
        'id_utilisateur',
        'type_notification',
        'titre',
        'description_notification',
        'date_creation',
        'date_lecture',
        'lu',
    ];
}
