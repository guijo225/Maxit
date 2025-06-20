const express = require("express");
const client = require("../db.js");
const bodyParser = require("body-parser");
const authenticateToken = require("../middleware/authenticate.js");

const router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));

router.post("/", authenticateToken, (req, res) => {
  const { id_tontine, id_utilisateur } = req.body;

  const date_adhesion = new Date().toISOString();
  const query =
    "INSERT INTO participant(id_tontine,id_utilisateur,date_adhesion) VALUES($1, $2, $3)";
  const values = [id_tontine, id_utilisateur, date_adhesion];

  client.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(201).json(results);
    }
  });
});

module.exports = router;
