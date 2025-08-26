import pool from '../config/db.js'; // J'importe la connexion à ma base de données PostgreSQL

//  pour ajouter un nouveau panier dans la base
export async function createPanier(id_utilisateur, id_article, nombre_article) {
    //  pour insérer un nouveau panier avec l'id utilisateur, l'id article et la quantité
    const sql = `
      INSERT INTO public.panier (id_utilisateur, id_article, nombre_article)
      VALUES ($1, $2, $3)
      RETURNING id_panier
    `;
    // j' utilise  pool.query pour executer la requete et je passe les valeurs en paramètres
    const result = await pool.query(sql, [id_utilisateur, id_article, nombre_article]);
    // Je retourne uniquement l'id du panier ajouté
    return result.rows[0];
}  

// pour récupérer tous les paniers d'un utilisateur
export async function getPaniersByUserId(id_utilisateur) {
  // Requête  pour sélectionner tous les paniers liés à un utilisateur spécifique
  const sql = `SELECT * FROM public.panier WHERE id_utilisateur = $1 ORDER BY id_panier`;
  // J'exécute la requête avec l'id de l'utilisateur
  const result = await pool.query(sql, [id_utilisateur]);
  // Je retourne tous les paniers trouvés
  return result.rows;
}

//  pour récupérer un panier spécifique par son id et l'id de l'utilisateur
export async function getPanierByIdAndUser(id_panier, id_utilisateur) {
  // Requête  pour sélectionner un panier précis correspondant à un utilisateur
  const sql = `SELECT * FROM public.panier WHERE id_panier = $1 AND id_utilisateur = $2`;
  // J'exécute la requête avec les deux paramètres
  const result = await pool.query(sql, [id_panier, id_utilisateur]);
  // Je retourne le panier trouvé
  return result.rows[0];
}

//  pour supprimer un panier (en fonction de l'utilisateur, l'article et la quantité)
export async function deletePanier(id_utilisateur, id_article, ) {
  // Requête  pour supprimer une ligne spécifique dans la table panier
  const sql = `
    DELETE FROM public.panier
    WHERE id_utilisateur = $1 AND id_article = $2 
    RETURNING *; -- Je retourne les données supprimées pour confirmation
  `;
  // J'exécute la requête avec les paramètres
  const result = await pool.query(sql, [id_utilisateur, id_article]);
  // Je retourne la ligne supprimée
  return result.rows[0];
}
