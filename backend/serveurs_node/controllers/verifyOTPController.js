import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
import{db} from "../models/db.js";

const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL
const BASE_URL = process.env.BASE_URL


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export const verifyOTP = async (req, res) => {
    const { numeroTelephone, otp, idUser } = req.body
    if (!numeroTelephone || !otp) {
        return res.status(400).json({ message: 'Numéro de téléphone ou OTP manquant' })
    }

    try {
        await db.query('BEGIN');
        const result = await db.query(
            `SELECT code_otp, otp_expiration FROM invitation WHERE numero_invite = $1 AND code_otp = $2`,
            [numeroTelephone, otp]
        )

        const userData = result.rows[0]

        if (!userData || userData.code_otp !== otp) {
            console.log(userData)
            return res.status(401).json({ message: 'OTP invalide' })
        }

        if (new Date() > new Date(userData.otp_expiration)) {
            await db.query(
                `UPDATE invitation SET code_otp = NULL, otp_expiration = NULL, updated_at = NOW() WHERE numero_invite = $1 AND code_otp = $2`,
                [numeroTelephone, otp]
            )
            return res.status(401).json({ message: 'OTP expiré' })
        }

        const resultat = await db.query(
            `SELECT id_tontine FROM invitation WHERE code_otp=$1 AND numero_invite = $2`,
            [otp, numeroTelephone]
        )

        const idTontine = resultat.rows[0].id_tontine

        await db.query(
            `UPDATE invitation SET code_otp = NULL, otp_expiration = NULL, updated_at = NOW() WHERE numero_invite = $1 AND code_otp = $2
            `,
            [numeroTelephone, otp]
        )

        const checkParticipantQuery = `SELECT * FROM participant WHERE id_utilisateur = $1 AND id_tontine = $2;`;
        const participantResult = await db.query(checkParticipantQuery, [idUser, idTontine]);

        if (participantResult.rows.length > 0) {
            return res.status(400).json({ error: 'Utilisateur déjà dans la tontine.' });
        }
        const resTontine = await db.query(`SELECT *  FROM tontine WHERE id_tontine=$1`, [idTontine])
        const infoTontine = resTontine.rows[0]

        const ParticipantQuery = `
        SELECT * FROM participant WHERE id_tontine = $1 ORDER BY numero_ordre;
        `;

        const participantNombreResult = await db.query(ParticipantQuery, [idTontine]);
        const numOrdre = participantNombreResult.rows.length + 1;
        await db.query(`INSERT INTO 
            participant (id_tontine, id_utilisateur, date_adhesion, numero_ordre, role_utilisateur) 
            VALUES ($1, $2, NOW(), $3,'membre')`
            , [idTontine, idUser, numOrdre]
        )
        if (numOrdre == infoTontine.nombre_participants) { 
                try {
                    const response = await fetch(`http://${BASE_URL}/api/ajoutTour/${idTontine}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('ligne 98',data)
                } catch (error) {
                    console.log({ error: error.message });
                }
        }

        await db.query('COMMIT')
        res.status(200).json({ message: 'OTP vérifié avec succès,integration reussie', idUser: idUser, tontine: infoTontine })
    } catch (error) {
        await db.query('ROLLBACK')
        console.error('Erreur lors de la vérification du code OTP', error.message)
        res.status(500).json({ message: 'Erreur lors de la vérification du code OTP', error: error.message })
    }

}