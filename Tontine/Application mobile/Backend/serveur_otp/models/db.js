require ('dotenv').config()
// const postgre = require('pg')
const { Pool } = require('pg')

const pool = new Pool ({
    user: process.env.POSTGRE_USER_NAME,
    host: process.env.POSTGRE_HOST,
    database : process.env.POSTGRE_DB_NAME,
    password: process.env.POSTGRE_PASSWORD,
    port: 5432
})

//test de la connexion 
pool.on('connect', ()=> {
    console.log('Connexion à la base de donnée réussie')
})

pool.on('error', (err)=> {
    console.log('Erreur lors de la Connexion à la base de donnée ')
    process.exit(-1)
})

// const db = postgre.createConnection({
//     host: process.env.POSTGRE_HOST,
//     port: 5432,
//     user: process.env.POSTGRE_USER_NAME,
//     password: process.env.POSTGRE_PASSWORD,
//     database : process.env.POSTGRE_DB_NAME,
    
// })

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
}