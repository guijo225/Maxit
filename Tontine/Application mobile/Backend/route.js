import {Afficher, creerTontine} from './controleur.js'
import express from 'express'

const router = express.Router();

router.get('/',Afficher);
router.post('/',creerTontine);

export default router;