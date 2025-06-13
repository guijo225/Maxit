const utilisateursModels = require('../models/utilisateursModels');


exports.getDashboardData = async (req, res) => {
  try {
    const stats = await utilisateursModels.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};