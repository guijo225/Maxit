from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.api_paiement.app.db import get_db_connection
from typing import Optional
from models.fonction_redistribution import appel_api_om
from models.fonction_redis_normal import appel_api_redis


app = FastAPI()

#Mettre à jour les modèles pour mieux réguler la provenance des variables

# Modèle de la requête
class PaiementRequest(BaseModel):
    numero: str
    tontine_id: int
    tour_id: int
    montant_distribue: float
    montant_total: float

class Participant(BaseModel):
    id_participant : int
    id_tontine: int
    a_recu_paiement : bool
    
async def verifier_et_payer(data: PaiementRequest):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 🔍 Récupérer les montants de la base
        cur.execute("SELECT montant_total, type_tontine, nombre_participants, montant_a_cotise, montant_cumule FROM tontine WHERE id_tontine = %s", (data.tontine_id,))
        tontine = cur.fetchone()

        cur.execute("SELECT montant_distribue, numero_tour FROM tour WHERE id_tour = %s", (data.tour_id,))
        tour = cur.fetchone()

        cur.execute("""
                        SELECT p.id_participant, p.a_recu_paiement, p.numero_ordre, u.contact 
                        FROM participant p JOIN utilisateur u 
                        ON p.id_utilisateur = u.id_utilisateur
                        WHERE id_tontine = %s
                        ORDER BY numero_ordre ASC
                    """, 
                    (data.tontine_id,)
                    )
        participant = cur.fetchall()
        
        if not tontine or not tour:
            raise HTTPException(status_code=404, detail="Tontine ou tour introuvable")
        montant_total = data.montant_total
        montant_distribue = data.montant_distribue
        montant_a_cotise = tontine['montant_a_cotise']
        type_tontine = tontine['type_tontine']
        montant_cumule = tontine['montant_cumule']
        nombre_participant = tontine['nombre_participants']
        numero_tour = tour['numero_tour']
        montant_distribue_tour = montant_a_cotise * nombre_participant
        print("Liste de participant ", participant)
        
        if type_tontine == 'Tontine différée':
            moitie_tour = nombre_participant/2
            if numero_tour < nombre_participant :
                if numero_tour >= round(moitie_tour) :
                    recipient: Optional[Participant] = None
                    print('Participants n\'ayant pas reçu leur tontine ', recipient)
                    for p in participant:
                        if p['a_recu_paiement'] == False:
                            recipient = participant[0]
                            break
                    if recipient:
                        montant_cumule -= montant_distribue_tour
                        await appel_api_om(recipient['contact'], montant_distribue_tour, recipient['id_participant'], montant_distribue, data.tour_id, montant_cumule, data.tontine_id)
            
            #Gestion de la redistribution au dernier tour
            if numero_tour == nombre_participant :
                membres_restant = [p for p in participant if not p['a_recu_paiement']]
                if membres_restant:
                    montant_par_membre = tontine['montant_cumule']/len(membres_restant)
                    print('liste des membres',membres_restant)
                    for membre in membres_restant:
                        print('membres',membre)
                        montant_cumule = 0.0
                        await appel_api_om(membre['contact'], montant_distribue_tour, membre['id_participant'], montant_distribue, data.tour_id, montant_cumule, data.tontine_id)
        else:
            if montant_total == montant_distribue :
                if type_tontine == 'Tontine avec assurance':
                    mode_paiement = 'assurance'
                    participant_ids = [p['id_participant'] for p in participant]
                    print(participant_ids)
                    try:
                        cur.execute("SELECT * FROM cotisation WHERE id_participant IN %d AND mode_paiement = %s", (tuple(participant_ids), mode_paiement))
                        cotisations = cur.fetchall()
                        print('Ligne 101', cotisations)
                        if (len(cotisations) == 0):
                            await appel_api_redis(data.numero, montant_distribue, data.tour_id, data.tontine_id)
                        else:
                            print("Tu n'auras rien champion, tu nous dois du fric")
                    except Exception as e:
                        print("Erreur lors de la vérification des cotisations :", e)
                        
                else:           
                    #🧾 Simuler un paiement réel via API mobile money
                    await appel_api_redis(data.numero, montant_distribue, data.tour_id, data.tontine_id)

            else:
                print("Montant différents, \n montant total = %f \n montant distribue : %f", montant_total, montant_distribue)
                return {
                    "message": "⛔ Montants différents, paiement non déclenché",
                    "montant_total": montant_total,
                    "montant_distribue": montant_distribue,
                }

    finally:
        if conn:
            conn.close()
            