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

exports.verifyOTP = async (req, res) => {
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

}