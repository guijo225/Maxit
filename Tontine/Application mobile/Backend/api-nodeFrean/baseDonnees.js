import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // permet de charger les variables d'environnement
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { require: true, rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // ferme les connexions après 30s d'inactivité
  connectionTimeoutMillis: 5000, // timeout max de connexion
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // tu peux relancer une connexion ici si besoin
});

setInterval(async () => {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    console.error("Keep-alive failed, reconnecting…", err.message);
  }
}, 60 * 1000);

export default pool;
