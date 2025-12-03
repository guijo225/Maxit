import { Afficher, creerTontine, updateTontine } from "../controllers/tontineController.js";
import express from "express";

const router = express.Router();

router.get("/afficher/:id", Afficher);
router.post("/", creerTontine);
router.post("/update", updateTontine);

export default router;
