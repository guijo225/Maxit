require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

client
  .connect()
  .then(() => console.log("Connexion réussie à PostgreSQL"))
  .catch((err) => console.error("Erreur de connexion", err.stack));

module.exports = client;
