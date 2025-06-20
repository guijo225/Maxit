const express = require("express");
const client = require("../db.js");
const bodyParser = require("body-parser");
const authenticateToken = require("../middleware/authenticate.js");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

router.post("/creeTontine/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const {
    nom_tontine,
    description_tontine,
    montant_a_cotise,
    frequence,
    date_echance,
    nombre_participants,
    regles,
  } = req.body;
  if (
    !nom_tontine ||
    !montant_a_cotise ||
    !frequence ||
    !date_echance ||
    !nombre_participants
  ) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }
  const montant_total = nombre_participants * montant_a_cotise;
  const date_creation = new Date().toISOString();
  const query =
    "INSERT INTO tontine(nom_tontine, description_tontine, montant_a_cotise, frequence, date_echance, montant_total, date_creation, nombre_participants, regles, id_utilisateur) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
  const values = [
    nom_tontine,
    description_tontine || null,
    montant_a_cotise,
    frequence,
    date_echance,
    montant_total,
    date_creation,
    nombre_participants,
    regles || null,
    id,
  ];
  console.log("Query:", query);
  console.log("Values:", values);
  client.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(201).json(results);
    }
  });
});

module.exports = router;
