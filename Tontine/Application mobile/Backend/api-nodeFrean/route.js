import {Afficher, creerTontine, integrerTontine} from './controleur.js'
import express from 'express'

const router = express.Router();

router.get('/afficher',Afficher);
router.post('/',creerTontine);
router.post('/integrer', integrerTontine);

export default router;