require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const {codeOTP} = require('./services/otp')
const {createMessage} = require('./services/sms')
const { generate } = require('otp-generator')

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
    const invitationExpires = Date.now() + 5 * 60 * 1000
    const lienInvitation = `${APP_BASE_URL}/invite?token=${invitationToken}`
    
    users['global_invite'] = {inviteToken : {token: invitationToken, expires: invitationExpires, used: false}}

    for (const recipient of recipientList) {
        const {numeroTelephone, name} = recipient
         
        if(!numeroTelephone) {
            results.push({ numeroTelephone, status:'failed', message: 'Numéro de téléphone manquant'})
            continue
        }

        const otp = codeOTP()
        const otpExpires = Date.now() + 5 * 60 * 1000

        //Stockage du code otp pour chaque invitation
        //wusers[numeroTelephone] = {...users[numeroTelephone], otp, otpExpires}

        const messageInvitation = `Vous avez été invité par (numéro de celui qui invite) à rejoindre la 
        tontine "Du champagne pour certains ou du lait pour tous". Cliquez sur ce lien ${lienInvitation} 
        et tapez ce code ${invitationToken} pour y adhérer`
        
        try {
            await createMessage(numeroTelephone, messageInvitation)
            results.push({numeroTelephone, status: 'success', message: 'SMS envoyé avec succès.', otp, lienInvitation})
        } catch (error) {
            results.push({numeroTelephone, status:'failed', message:"Erreur lors de l'envoi du SMS", error: error.message})
        }
    }

    res.status(200).json({message: 'Traitement des envois de SMS terminés', results})
})

app.post('/verify-otp', (req, res) => {
    const {numeroTelephone, otp} = req.body

    if (!numeroTelephone || !otp) {
        return res.status(400).json({message:'Numéro de téléphone ou OTP manquant'})
    }

    const userData = users[numeroTelephone]

    if (!userData || userData.otp !== otp) {
        return res.status(401).json({ message: 'OTP invalide'})
    }

    if (Date.now() > userData.otpExpires) {
        delete userData.otp
        delete userData.otpExpires
        return res.status(401).json({message : 'OTP expiré'})
    }

    delete userData.otp
    delete userData.otpExpires
    res.status(200).json({message: 'OTP vérifié avec succès'})
})

app.get('/invite', (req, res)=> {
    const {token} = req.query

    if(!token) {
        return res.status(400).send("Token d'invitation manquant")
    }

    const invitationData = users['global_invite']?.inviteToken
    if (!invitationData || invitationData.token !== token) {
        return res.status(404).send("Lien d'invitation invalide")
    }

    if (invitationData.used) {
        return res.status(400).send("Ce lien d'invitation a déjà été utilisé")
    }

    if (Date.now() > invitationData.expires) {
        delete users['global_invite'].inviteToken
        return res.status(401).send("Ce lien a expiré")
    }

    invitationData.used = true
    res.status(200).send(`Bienvenue vous pouvez intégrer la tontine`)
})



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`Base URL for invitations ${APP_BASE_URL}`)
}) 