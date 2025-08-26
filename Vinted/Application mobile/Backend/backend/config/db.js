import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',        // utilisateur PostgreSQL
  password: 'Ys.vohlma1',     //  mot de passe PostgreSQL
  database: 'panierdb',    // nom de ta base
  port: 5433             // port PostgreSQL
});

pool.connect()
  .then(() => console.log('connecté à la base de données'))
  .catch(err => console.error('Erreur connexion BDD:', err));

export default pool;
