require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const {codeOTP} = require('./services/otp')
const {createMessage} = require('./services/sms')
// const {getClient} = require('./models/db')
const db = require('./models/db')

const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const users = {}

app.post('/send-otp', async(req, res) => {
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
})

app.post('/verify-otp', async (req, res) => {
    const {numeroTelephone, otp} = req.body

    if (!numeroTelephone || !otp) {
        return res.status(400).json({message:'Numéro de téléphone ou OTP manquant'})
    }

    try {
        const result = await db.query(
            `SELECT code_otp, otp_expiration FROM invitation WHERE numero_invite = $1`,
            [numeroTelephone]
        )

        const userData = result.rows[0]

        if (!userData || userData.code_otp !== otp) {
            console.log(userData)
            return res.status(401).json({ message: 'OTP invalide'})
        }

        if (new Date() > new Date(userData.otp_expiration)) {
            await db.query(
                `UPDATE invitation SET code_otp = NULL, otp_expiration = NULL, updated_at = NOW() WHERE numero_invite = $1`,
                [numeroTelephone]
            )
            return res.status(401).json({message : 'OTP expiré'})
        }

        await db.query(
            `UPDATE invitation SET code_otp = NULL, otp_expiration = NULL, updated_at = NOW() WHERE numero_invite = $1`,
            [numeroTelephone]
        )
        res.status(200).json({message: 'OTP vérifié avec succès'})        
    } catch (error) {
        console.error('Erreur lors de la vérification du code OTP')
        res.status(500).json({message: 'Erreur lors de la vérification du code OTP'})
    }

})

app.get('/invite', async (req, res)=> {
    const {token} = req.query

    if(!token) {
        return res.status(400).send("Token d'invitation manquant")
    }

    try {
        const result = await db.query(
            `SELECT token_invitation, expiration_token_invitation
            FROM invitation
            WHERE numero_invite = '_GLOBAL_INVITE_TOKEN_' AND token_invitation = $1
            `, [token]
        )

        const invitationData = result.rows[0]
        if (!invitationData) {
            return res.status(404).send("Lien d'invitation invalide")
        }

        if (invitationData.invitation_utilise) {
            return res.status(400).send("Ce lien d'invitation a déjà été utilisé")
        }

        if (new Date > new Date (invitationData.expiration_token_invitation)) {
            await db.query(
                `UPDATE invitation SET token_invitation = NULL, expiration_token_invitation = NULL, updated_at = NOW() WHERE numero_invite = '_GLOBAL_INVITE_TOKEN'`
            )
            return res.status(401).send("Ce lien a expiré")
        }

        await db.query(
            `UPDATE invitation SET invitation_utilise = TRUE, updated_at = NOW() WHERE numero_invite = '_GLOBAL_INVITE_TOKEN'`
        )
        res.status(200).send(`Bienvenue vous pouvez intégrer la tontine`)
    } catch (error) {
        console.error('Erreur lors de la procédure de vérification des tokens ou de la vérificationd de la BD:', error)
        res.status(500).send('Erreur interne du serveur lors de la validation des tokens')
    }
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`Base URL for invitations ${APP_BASE_URL}`)
}) 