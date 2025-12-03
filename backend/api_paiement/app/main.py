from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from api_paiement.app.db import get_db_connection
from controllers.info_paiement import get_infos_paiement
from controllers.redistribution import verifier_et_payer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]  # sinon mets ton domaine Render

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/paiement")
async def paiement(data: PaiementRequest):
    paiement = await verifier_et_payer(data)
    return paiement

#Route API pour récupérer les informations sur la tontine et le participant
@app.get("/infos_paiement/id_user/{id_utilisateur}/id_tontine/{id_tontine}/id_tour/{id_tour}")
async def infos_paiement(id_utilisateur: int, id_tontine: int, id_tour: int):
    return get_infos_paiement(id_utilisateur, id_tontine, id_tour)

@app.get("/etat")
def etat(tontine_id: int, tour_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Lire les montants depuis la base
        cur.execute("SELECT montant_total FROM tontine WHERE id_tontine = %s", (tontine_id,))
        tontine = cur.fetchone()

        cur.execute("SELECT montant_distribue FROM tour WHERE id_tour = %s" , (tour_id,))
        tour = cur.fetchone()

        if not tontine or not tour:
            raise HTTPException(status_code=404, detail="Tontine ou tour introuvable")

        montant_total = tontine[0]
        montant_distribue = tour[0]

        return {
            "montant_total": montant_total,
            "montant_distribue": montant_distribue,
            "paiement_possible": montant_total == montant_distribue
        }

    finally:
        if conn:
            conn.close()