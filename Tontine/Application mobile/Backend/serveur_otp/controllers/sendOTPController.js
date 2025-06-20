require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const {codeOTP} = require('../services/otp')
const {createMessage} = require('../services/sms')
// const {getClient} = require('./models/db')
const db = require('../models/db')

const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

exports.sendOTP = async(req, res) => {
    const {recipients: recipientList} = req.body
    if (!recipientList || !Array.isArray(recipientList) || recipientList.length === 0) {
        return res.status(400).json({message: "Vous n'avez sélectionné aucun contact"})
    }

    const results = []
    const invitationToken = Math.random().toString(36).substring(2,15)+ Math.random().toString(36).substring(2,15);
    const invitationExpires = new Date (Date.now() + 10 * 60 * 1000)
    const lienInvitation = `${APP_BASE_URL}/invite?token=${invitationToken}`
    
    //users['global_invite'] = {inviteToken : {token: invitationToken, expires: invitationExpires, used: false}}

    const client = await db.getClient()
    try {
        await client.query('BEGIN')

        await client.query(
            `INSERT INTO invitation (numero_invite, token_invitation, expiration_token_invitation, invitation_utilise)
            VALUES ('_GLOBAL_INVITE_TOKEN_', $1, $2, FALSE)
            ON CONFLICT (numero_invite) DO UPDATE
            SET token_invitation = EXCLUDED.token_invitation, expiration_token_invitation = EXCLUDED.expiration_token_invitation, invitation_utilise = FALSE, updated_at = NOW() 
            `, [invitationToken, invitationExpires])
            for (const recipient of recipientList) {
                const {numeroTelephone, name} = recipient
                
                if(!numeroTelephone) {
                    results.push({ numeroTelephone, status:'failed', message: 'Numéro de téléphone manquant'})
                    continue
                }

                const otp = codeOTP()
                const otpExpires = new Date (Date.now() + 10 * 60 * 1000)
                
                try {
                    await client.query(
                        `
                            INSERT INTO invitation (numero_invite, code_otp, otp_expiration)
                            VALUES ($1, $2, $3)
                            ON CONFLICT (numero_invite) DO UPDATE
                            SET code_otp = EXCLUDED.code_otp, otp_expiration = EXCLUDED.otp_expiration, updated_at = NOW()
                            RETURNING *
                        `, [numeroTelephone, otp, otpExpires]
                    )

                    const messageInvitation = `Vous avez été invité à rejoindre la 
                        tontine "Du champagne pour certains ou du lait pour tous". Cliquez sur ce lien ${lienInvitation} 
                        et tapez ce code ${invitationToken} pour y adhérer`
                    await createMessage(numeroTelephone, messageInvitation)
                    results.push({numeroTelephone, status: 'success', message: 'SMS envoyé avec succès.', otp, lienInvitation})
                } catch (error) {
                    console.error(`Erreur pour ${numeroTelephone}:`, error)
                    results.push({numeroTelephone, status:'failed', message:"Erreur lors de l'envoi du SMS", error: error.message})
                }
            }
            await client.query('COMMIT')
            res.status(200).json({message: 'Traitement des envois de SMS terminés', results})   
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Erreur lors du traitement :', error)
        res.status(500).json({message : "Erreur lors de l'envoi de messages", error: error.message})
    } finally {
        client.release()
    }
}