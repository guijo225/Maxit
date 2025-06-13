const tontineModel = require('../models/tontineModels');

exports.getDashboardData = async (req, res) => {
  try {
    const stats = await tontineModel.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
