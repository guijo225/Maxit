import express from 'express';
import { postAddpanier, getPaniersController, getPanierController, deletePanierAll } from '../controllers/panierController.js';
import pool from '../config/db.js';

const router = express.Router();

// GET /panier (liste tous les paniers)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.panier ORDER BY id_panier ASC');
    res.json({ paniers: result.rows });
  } catch (err) {
    console.error('Erreur route GET /panier:', err.stack);
    res.status(500).json({ error: 'Erreur serveur  '+ err.stack });
  }
});

// POST /panier
router.post('/', postAddpanier);

// GET /panier/user/:id_utilisateur
router.get('/user/:id_utilisateur', getPaniersController);

// GET /panier/user/:id_utilisateur/:id_panier
router.get('/user/:id_utilisateur/:id_panier', getPanierController);
// DELETE les articles de la db selon id utlisateur
router.delete('/user', deletePanierAll);


export default router;
