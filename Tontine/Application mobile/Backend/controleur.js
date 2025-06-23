import pool from './baseDonnees.js'

export const Afficher = async(res,req)=>{
try {
  const res = await pool.query('SELECT * FROM messages');
  console.log(res.rows);
} catch (err) {
  console.error('Erreur de connexion :', err);
}}

//Créer une tontine
export const creerTontine = async (req, res) => {
  const id = 2; // ID utilisateur fictif (à remplacer par un vrai auth système)

  const {
    nom,
    description,
    regles,
    montant,
    participants,
    frequence,
    date_echeance,
  } = req.body;

  if (!nom || !montant || !frequence || !participants || !date_echeance) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const montant_a_cotise = parseFloat(montant);
  const nombre_participants = parseInt(participants);

  if (isNaN(montant_a_cotise) || isNaN(nombre_participants)) {
    return res.status(400).json({ error: 'Montant ou nombre de participants invalide' });
  }

  const montant_total = nombre_participants * montant_a_cotise;
  const date_creation = new Date().toISOString();
  const date_debut = new Date().toISOString();
  const statut_tontine = 'en_attente';

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Étape 1 : Créer la tontine
    const insertTontineQuery = `
      INSERT INTO tontine (
        nom_tontine,
        description_tontine,
        regles,
        montant_a_cotise,
        montant_total,
        nombre_participants,
        statut_tontine,
        date_creation,
        date_debut,
        date_echeance,
        id,
        frequence
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id_tontine;
    `;

    const valuesTontine = [
      nom,
      description || null,
      regles || null,
      montant_a_cotise,
      montant_total,
      nombre_participants,
      statut_tontine,
      date_creation,
      date_debut,
      date_echeance,
      id,
      frequence
    ];

    const tontineResult = await client.query(insertTontineQuery, valuesTontine);
    const id_tontine = tontineResult.rows[0].id_tontine;

    // Étape 2 : Ajouter le gerant dans participants
    const insertParticipantQuery = `
      INSERT INTO participants (id, id_tontine, date_adhesion, role)
      VALUES ($1, $2, $3, $4);
    `;

    await client.query(insertParticipantQuery, [
      id,
      id_tontine,
      new Date().toISOString(),
      'gérant'
    ]);

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Tontine créée et créateur ajouté comme participant',
      id_tontine: id_tontine
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la création de la tontine :', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    client.release();
  }
};
