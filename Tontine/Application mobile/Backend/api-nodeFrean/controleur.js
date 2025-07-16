import pool from './baseDonnees.js'


export const Afficher = async (req, res) => {
  try {
    const id  = req.query.id
    //console.log('l id est :'+id)
    const query = 'SELECT * FROM tontine, participant WHERE participant.id_utilisateur = $1 AND participant.id_tontine = tontine.id_tontine';
    const resultat = await pool.query(query,[id]);
    //console.log(resultat.rows);
    return res.status(200).json(resultat.rows);
  } catch (err) {                                                                                                                                                                                                                            
    console.error('Erreur de connexion :', err);
    return res.status(500).json({ error: err.message });
  }
};


//Créer une tontine
export const creerTontine = async (req, res) => {

  const {
    nom,
    description,
    regles,
    montant,
    participants,
    frequence,
    date_echeance,
    id_utilisateur, 
    type_tontine
  } = req.body;

  if (!nom || !montant || !frequence || !participants || !type_tontine) {
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
        id_utilisateur,
        frequence,
        type_tontine
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, $13)
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
      id_utilisateur,
      frequence,
      type_tontine
    ];

    const tontineResult = await client.query(insertTontineQuery, valuesTontine);
    const id_tontine = tontineResult.rows[0].id_tontine;
    const tontine = tontineResult.rows[0].tontine;

    // Étape 2 : Ajouter le gerant dans participants
    const insertParticipantQuery = `
      INSERT INTO participant (id_utilisateur, id_tontine, date_adhesion, role_utilisateur, numero_ordre, a_recu_paiement)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const numOrdre = 1;

    await client.query(insertParticipantQuery, [
      id_utilisateur,
      id_tontine,
      new Date().toISOString(),
      'admin',
      numOrdre,
      false
    ]);

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Tontine créée et créateur ajouté comme participant',
      tontine: tontine
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la création de la tontine :', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    client.release();
  }
};


//Integrer une tontine
export const integrerTontine = async (req, res) => {
  const { id_utilisateur, id_tontine } = req.body;

  if (!id_utilisateur || !id_tontine) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Étape 1 : Vérifier si l'utilisateur est déjà dans la tontine
    const checkParticipantQuery = `
      SELECT * FROM participant WHERE id_utilisateur = $1 AND id_tontine = $2;
    `;
    const participantResult = await client.query(checkParticipantQuery, [id_utilisateur, id_tontine]);

    if (participantResult.rows.length > 0) {
      return res.status(400).json({ error: 'Utilisateur déjà dans la tontine.' });
    }

    // Étape 2 : Ajouter l'utilisateur comme participant
    /*const insertParticipantQuery = `
      INSERT INTO participant (id_utilisateur, id_tontine, date_adhesion, role_utilisateur, numero_ordre, a_recu_paiement)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;*/

    const ParticipantQuery = `
      SELECT * FROM participant WHERE id_tontine = $1 ORDER BY numero_ordre;
    `;
    
    const participantNombreResult = await client.query(ParticipantQuery, [id_tontine]);
    const numOrdre = participantNombreResult.rows.length + 1;

    const insertParticipantQuery = `
      INSERT INTO participant (id_utilisateur, id_tontine, date_adhesion, role_utilisateur, numero_ordre, a_recu_paiement)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    //const numOrdre = participantResult.rows.length + 1;

    await client.query(insertParticipantQuery, [
      id_utilisateur,
      id_tontine,
      new Date().toISOString(),
      'participant',
      numOrdre,
      false
    ]);

    await client.query('COMMIT');

    return res.status(201).json({ message: 'Utilisateur ajouté à la tontine.' ,id_tontine: id_tontine });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'intégration à la tontine :', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    client.release();
  }
};
