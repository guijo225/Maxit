import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import serverOtp from "./routes/otpRoutes.js"
import tontine from "./routes/tontineRoutes.js"
const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', serverOtp)
app.use('/first', tontine)



app.listen(PORT,'0.0.0.0', ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`Base URL for invitations ${APP_BASE_URL}`)
}) 