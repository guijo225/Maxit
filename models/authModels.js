const db = require('../db');

// Recherche un admin par son identifiant
exports.findById = async (identifiant_admin) => {
  const result = await db.query(
    'SELECT * FROM administrateur WHERE identifiant_admin = $1',
    [identifiant_admin]
  );
  return result.rows[0];
};