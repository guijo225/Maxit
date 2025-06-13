const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateurModel = require('../models/authModels');

// Ajout d'un administrateur
exports.ajouterAdmin = async (req, res) => {
  const { identifiant_admin, role_admin, mot_de_passe } = req.body;
  if (!identifiant_admin || !role_admin || !mot_de_passe) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  try {
    const existingAdmin = await pool.query(
      'SELECT * FROM administrateur WHERE identifiant_admin = $1',
      [identifiant_admin]
    );
    if (existingAdmin.rows.length > 0) {
      return res.status(409).json({ error: 'Cet identifiant existe déjà' });
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      `INSERT INTO administrateur (identifiant_admin, role_admin, mot_de_passe, date_connexion)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [identifiant_admin, role_admin, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Liste tous les administrateurs
exports.listerAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administrateur');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion d'un administrateur
exports.login = async (req, res) => {
  const { identifiant_admin, mot_de_passe } = req.body;

  try {
    // Recherche l'utilisateur par identifiant
    const user = await utilisateurModel.findById(identifiant_admin);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    // Vérifie le mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    return res.json({ message: 'Connexion réussie' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};