require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./models/db')
const serverOtp = require('./routes/otpRoutes')
const app = express()
const PORT = process.env.PORT || 3000
const APP_BASE_URL = process.env.APP_BASE_URL

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', serverOtp)



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`Base URL for invitations ${APP_BASE_URL}`)
}) 