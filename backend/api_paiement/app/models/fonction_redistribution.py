from fastapi import HTTPException
from backend.api_paiement.app.db import get_db_connection
from datetime import datetime
import httpx

async def appel_api_om(contact, montant_redistribue, id_participants, montant_distribue, id_tour, montant_cumule, id_tontine) :
    #print(f"Contact : {contact}; Montant redistribue : {montant_redistribue}; id_participants : {id_participants}; montant distribue: {montant_distribue}; id tour: {id_tour}; montant cumule: {montant_cumule}; id tontine: {id_tontine}")
    try: 
        conn = get_db_connection()
        cur = conn.cursor()
        async with httpx.AsyncClient() as client:
            url = "http://192.168.252.13:8002/api/om_transactions_simules"  # 🔁 À remplacer par la vraie URL
            payload = {
                "telephone": contact, 
                "montant": float(montant_redistribue),
                "statut":"retrait"
            }
            
            headers = {
                "Authorization": "Bearer VOTRE_JETON_D_API",  # 🔐 À remplacer par ton vrai token
                "Content-Type": "application/json"
            } 
            response = await client.post(url, json=payload)
            res = response.json()
            if response.status_code == 201:
                id_participant = id_participants
                
                cur.execute("""
                    INSERT INTO transactions (
                    numero_transaction,
                    type_transaction,
                    montant_transaction,
                    date_transaction,
                    statut_transaction,
                    id_participant,
                    id_tour
                    ) 
                    VALUES (%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                    res['data']['transaction_id'],
                    "redistribution",
                    montant_distribue,
                    datetime.now(),
                    "succès",
                    id_participant,
                    id_tour,
                    ))
                cur.execute(
                    """
                    UPDATE participant
                    SET a_recu_paiement = true
                    WHERE id_participant = %s
                    """,
                    (id_participant,)
                )
                cur.execute(
                    """
                    UPDATE tontine
                    SET montant_cumule = %s
                    WHERE id_tontine = %s
                    """,
                    (montant_cumule, id_tontine,)
                )
                conn.commit()
            else:
                raise HTTPException(status_code=502, detail="❌ Paiement échoué sur Orange Money")
    except Exception as e:
        print("Pas passé parce que: ", e)