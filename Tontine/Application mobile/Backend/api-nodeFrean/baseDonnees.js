import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();// permet de charger les variables d'environnement
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});
export default pool;

