require ('dotenv').config()

const twilio = require('twilio')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const numeroTwilio = process.env.TWILIO_PHONE_NUMBER
const client = twilio(accountSid, authToken)

const createMessage = async (to, message) => {
    try {
        const info = await client.messages.create({
            body: message,
            from: +16073669372,
            to: to
        })
    } catch (error) {
        console.error('Erreur lors de l\'envoie du message:', error)
        throw error
    }
}

module.exports = {createMessage}

// async function createMessage() {
//     const message = await client.messages.create({
//         body: "Vous avez été invité à rejoindre une tontine par le numéro (Numéro du créateur de la tontine) voici le lien "
//     })
// }