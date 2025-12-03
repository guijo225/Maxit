import math
from fastapi import FastAPI, HTTPException, requests, status
from backend.api_paiement.app.db import get_db_connection
from decimal import Decimal


def get_infos_paiement(id_utilisateur: int, id_tontine: int, id_tour: int):
    print(id_utilisateur)
    print(id_tontine)    
    print(id_tour)    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.montant_a_cotise, t.type_tontine, t.nombre_participants, u.contact, id_participant
        FROM participant p
        INNER JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur
        INNER JOIN tontine t ON p.id_tontine = t.id_tontine
        WHERE p.id_utilisateur = %s AND p.id_tontine = %s
        """, (id_utilisateur, id_tontine))
    utilisateur = cursor.fetchone()
    cursor.close()
    cur = conn.cursor()
    cur.execute("""
                SELECT montant_penalite
                FROM penalite
                WHERE id_participant = %s AND id_tour= %s
                """, (utilisateur['id_participant'], id_tour))
    mnt_penalite = cur.fetchone()
    cur.close()
    conn.close()
    print(mnt_penalite)
    print(utilisateur)
    
    if utilisateur:
        if utilisateur['type_tontine'] == 'Tontine avec assurance':
            #commission = commissions(utilisateur['montant_a_cotise'])
            montant = montant_assurance(utilisateur['montant_a_cotise'], utilisateur['nombre_participants'])
            if mnt_penalite:
                commissionPenalite = commissions(montant + float(mnt_penalite['montant_penalite']))
                return {"montant_a_cotise" : montant, "contact" : utilisateur['contact'], "id_participant" : utilisateur['id_participant'], "montant_penalite" : mnt_penalite['montant_penalite'], "montant_a_cotise_penalite" : commissionPenalite}

            return {"montant_a_cotise" : montant, "contact" : utilisateur['contact'], "id_participant" : utilisateur['id_participant']}
            
            # montant = montant_assurance(utilisateur['montant_a_cotise'], utilisateur['nombre_participants'])             
            # return {"montant_a_cotise" : montant, "contact" : utilisateur['contact'], "id_participant" : utilisateur['id_participant'], "montant_penalite" : mnt_penalite}
        else :
            commission = commissions(utilisateur['montant_a_cotise'])
            if mnt_penalite:
                commissionPenalite = commissions(utilisateur['montant_a_cotise']) + float(mnt_penalite['montant_penalite'])
                return {"montant_a_cotise" : commission, "contact" : utilisateur['contact'], "id_participant" : utilisateur['id_participant'], "montant_penalite" : mnt_penalite['montant_penalite'], "montant_a_cotise_penalite" : commissionPenalite}

            return {"montant_a_cotise" : commission, "contact" : utilisateur['contact'], "id_participant" : utilisateur['id_participant']}
    else:
        raise HTTPException(status_code=404, detail="Aucune donnée trouvée.")
    
def montant_assurance(montant:Decimal, nb_participant:int) :
    mnt = float(montant) + round(float(montant) * (1/nb_participant)) + (float(montant) * 0.025)
    mnt_arrondi = math.ceil(mnt / 10) * 10
    return mnt_arrondi

def commissions(montant:Decimal) : 
    mnt = float(montant) + (float(montant) * 0.025)
    mnt_arrondi = math.ceil(mnt / 10) * 10
    return mnt_arrondi