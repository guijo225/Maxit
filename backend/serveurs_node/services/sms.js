import dotenv from "dotenv"
dotenv.config()
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const numeroTwilio = process.env.TWILIO_PHONE_NUMBER
const client = twilio(accountSid, authToken)

export const createMessage = async (to, message) => {
    try {
        const info = await client.messages.create({
            body: message,
            from: +18787687416,
            to: to
        })
    } catch (error) {
        console.error('Erreur lors de l\'envoie du message:', error)
        throw error
    }
}
