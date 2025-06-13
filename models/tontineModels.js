const db = require('../db');

exports.getStats = async () => {
  const tontine = await db.query('SELECT COUNT(*) FROM tontine');


  return {
    nombre_de_tontine: tontine.rows[0].count,
  };
};
