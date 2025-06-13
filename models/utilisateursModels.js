const db = require('../db');

exports.getStats = async () => {
    const utilisateurs = await db.query('SELECT COUNT(*) FROM utilisateur');
    return {
        nombre_d_utilisateurs: utilisateurs.rows[0].count,
    };  
 };

