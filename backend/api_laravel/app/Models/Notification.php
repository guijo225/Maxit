<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['id_notification', 'type_notification', 'titre', 'description_notification', 'date_creation', 'lu', 'date_lecture', 'id_utilisateur', 'id_tontine'];
    protected $table = 'notification';
    protected $primaryKey = 'id_notification';
    public $timestamps = false;

    public function utilisateur(){
        return $this->belongsTo(Utilisateur::class, 'id_participant');
    }

    public function tour() {
        return $this->belongsTo(Tour::class, 'id_tour');
    }
}
