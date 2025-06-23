const express = require("express");
const client = require("../db.js");
const bodyParser = require("body-parser");
const authenticateToken = require("../middleware/authenticate.js");

const router = express.Router();

// Middleware pour parser le JSON
router.use(bodyParser.json());

// Route GET pour renvoyer les notifications
router.get("/notif", (req, res) => {
  // const utilisateur_id=req.params.id;
  const utilisateur_id = 1;

  if (!utilisateur_id) {
    return res.status(400).json({ error: "donnees manquant" });
  }
  const query = "SELECT * FROM notification_tontine WHERE utilisateur_id=$1";
  const values = [utilisateur_id];

  client.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(201).json({ data: results.rows });
    }
  });
});

// Route POST pour insérer une notification
router.post("/notif", (req, res) => {
  const {
    utilisateur_id,
    id_tontine,
    titre,
    type_notification,
    description_notification,
    url,
  } = req.body;

  const date_creation = new Date().toISOString();

  // Vérification des champs
  if (
    !utilisateur_id ||
    !id_tontine ||
    !titre ||
    !date_creation ||
    !type_notification
  ) {
    return res.status(400).json({ error: "champs manquants" });
  }

  const query = `
    INSERT INTO notification_tontine(utilisateur_id, id_tontine, titre, date_creation, type_notification, description_notification, url)
    VALUES($1, $2, $3, $4, $5, $6, $7)`;

  const values = [
    utilisateur_id,
    id_tontine,
    titre,
    date_creation,
    type_notification,
    description_notification || null,
    url || null,
  ];

  client.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res
        .status(201)
        .json({ message: "Notification enregistrée", data: results.rows[0] });
    }
  });
});

module.exports = router;
