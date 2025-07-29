<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penalite extends Model
{
    use HasFactory;

    protected $primaryKey = "id_penalite";

    protected $table = "penalite";

    public $timestamps = false;

    public $incrementing = false;


    protected $fillable = [
        "id_penalite",
        "montant_penalite",
        "motif",
        "date_penalite",
        "id_tour",
        "statut_penalite",
        "id_participant",
    ];
}
