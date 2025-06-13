const express = require('express');
const router = express.Router();
const adminController = require('../controllers/authController');

// Route pour ajouter un administrateur
router.post('/', adminController.ajouterAdmin);

// Route pour lister tous les administrateurs
router.get('/', adminController.listerAdmins);

// Route pour la connexion d'un administrateur
router.post('/login', adminController.login);

module.exports = router;