from fastapi import HTTPException
from backend.api_paiement.app.db import get_db_connection
from datetime import datetime
import httpx
import traceback

async def appel_api_redis(contact, montant_distribue, id_tour, id_tontine) :
    try: 
        conn = get_db_connection()
        cur = conn.cursor()
        async with httpx.AsyncClient() as client:
                        url = "http://192.168.252.13:8002/api/om_transactions_simules"  # 🔁 À remplacer par la vraie URL
                        payload = {
                            "telephone": contact,
                            "montant": float(montant_distribue),
                            "statut":"retrait"
                        }
                        
                        headers = {
                            "Authorization": "Bearer VOTRE_JETON_D_API",  # 🔐 À remplacer par ton vrai token
                            "Content-Type": "application/json"
                        } 

                        # Tu peux aussi ajouter un header Authorization ici si besoin
                        response = await client.post(url, json=payload)
                        print(response.json())
                        res = response.json()
                        print('Lign 30',res)
                        print('Lign 30',res['data']['transaction_id'])
                        transaction_id = res['data']['transaction_id']
                        if response.status_code == 201:
                            try:
                        # 🎭 Simulation du paiement sans appel externe
                                cur.execute("""SELECT p.id_participant 
                                            FROM participant p JOIN tour t ON 
                                            p.numero_ordre = t.numero_tour WHERE t.id_tour = %s AND p.id_tontine= %s """,
                                            (id_tour, id_tontine))
                                participants = cur.fetchone()
                                print()
                                print('ligne 40',participants)
                                if not participants:
                                    raise HTTPException(status_code=404, detail="Participant non trouvé")
                                id_participant = participants["id_participant"]
                                print(id_participant," ligne 45")
                                
                                cur.execute(
                                    """
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
                                    transaction_id,
                                    "redistribution",
                                    float(montant_distribue),
                                    datetime.now(),
                                    "succès",
                                    id_participant,
                                    id_tour
                                    ))
                                print("variable", id_participant)
                                print("variable tableau", participants["id_participant"])
                                cur.execute(
                                    """
                                    UPDATE participant
                                    SET a_recu_paiement = true
                                    WHERE id_participant = %s
                                    """,
                                    (id_participant,)
                                )
                                conn.commit()
                                return { 
                                    "message": "✅ Paiement simulé avec succès.",
                                    "vers": contact,
                                    "montant": montant_distribue,
                                    "reference": f"tontine_{id_tontine}_tour_{id_tour}",
                                    "raison": "Montant atteint ou échéance atteinte"
                                }
                            except Exception as e:
                                print(e)
                                traceback.print_exc()
                                raise HTTPException(status_code=500, detail=f"Erreurr serveur: {str(e)}")
                        else:
                            raise HTTPException(status_code=500, detail="❌ Paiement échoué sur Orange Money")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")