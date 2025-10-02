import { Afficher, creerTontine, updateTontine } from "./controleur.js";
import express from "express";

const router = express.Router();

router.get("/afficher", Afficher);
router.post("/", creerTontine);
// router.post('/integrer', integrerTontine);
router.post("/update", updateTontine);

export default router;
