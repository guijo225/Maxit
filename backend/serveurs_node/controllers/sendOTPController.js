import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
import{codeOTP} from "../services/otp.js"
import{db} from "../models/db.js";

const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

export const sendOTP = async(req, res) => {
    const {recipients: recipientList, id_tontine, nom_tontine} = req.body
    if (!recipientList || !Array.isArray(recipientList) || recipientList.length === 0) {
        return res.status(400).json({message: "Vous n'avez sélectionné aucun contact"})
    }

    console.log('ligne 22' . id_tontine)

    const results = []
    const invitationToken = Math.random().toString(36).substring(2,15)+ Math.random().toString(36).substring(2,15);
    const invitationExpires = new Date (Date.now() + 60 * 60 * 1000)
    const lienInvitation = `${APP_BASE_URL}/invite?token=${invitationToken}`
    
    //users['global_invite'] = {inviteToken : {token: invitationToken, expires: invitationExpires, used: false}}

    const client = await db.getClient()
    try {
        await client.query('BEGIN')

        await client.query(
            /*`INSERT INTO invitation (numero_invite, token_invitation, expiration_token_invitation, invitation_utilise, id_tontine)
            VALUES ('_GLOBAL_INVITE_TOKEN_', $1, $2, FALSE, $3)
            ON CONFLICT (numero_invite) DO UPDATE
            SET token_invitation = EXCLUDED.token_invitation, expiration_token_invitation = EXCLUDED.expiration_token_invitation, invitation_utilise = FALSE, updated_at = NOW() 
            `*/
            `INSERT INTO invitation (numero_invite, token_invitation, expiration_token_invitation, invitation_utilise, id_tontine)
            VALUES ($1, $2, $3, FALSE, $4)
            `
            , [nom_tontine, invitationToken, invitationExpires, id_tontine])
            for (const recipient of recipientList) {
                const {numeroTelephone, name} = recipient
                
                if(!numeroTelephone) {
                    results.push({ numeroTelephone, status:'failed', message: 'Numéro de téléphone manquant'})
                    continue
                }

                const checkInvite = await db.query(
                `SELECT * FROM invitation WHERE numero_invite = $1 AND id_tontine = $2`,
                [numeroTelephone, id_tontine]
                );

                if (checkInvite.rows.length > 0) {
                await db.query('ROLLBACK');
                return res.status(409).json({
                    message: 'Ce numéro est déjà invité dans cette tontine.'
                });
                } 

                const otp = codeOTP()
                const otpExpires = new Date (Date.now() + 60 * 60 * 1000)
                
                try {
                    await client.query(
                        `
                            INSERT INTO invitation (numero_invite, code_otp, otp_expiration, id_tontine)
                            VALUES ($1, $2, $3, $4)
                            RETURNING *
                        `, [numeroTelephone, otp, otpExpires, id_tontine]
                    )

                    const messageInvitation = `Vous avez été invité à rejoindre la tontine "tontine ODA". Cliquez sur ce lien ${lienInvitation} et tapez ce code ${otp} pour y adhérer`
                    //await createMessage(numeroTelephone, messageInvitation)
                    results.push({numeroTelephone, status: 'success', message: 'SMS envoyé avec succès.', otp, lienInvitation})
                } catch (error) {
                    console.error(`Erreur pour ${numeroTelephone}:`, error)
                    results.push({numeroTelephone, status:'failed', message:"Erreur lors de l'envoi du SMS", error: error.message})
                    break
                }
            }
            await client.query('COMMIT')
            res.status(200).json({message: 'Traitement des envois de SMS terminés', results})   
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Erreur lors du traitement :', error)
        // res.status(500).json({message : "Erreur lors de l'envoi de messages", error: error.message})
    } finally {
        client.release()
    }
}