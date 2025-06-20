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

exports.invite = async (req, res)=> {
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
}