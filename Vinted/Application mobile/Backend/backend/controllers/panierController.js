import { createPanier, getPaniersByUserId, getPanierByIdAndUser, deletePanier } from '../models/panierModel.js';

// Ajouter un panier
export async function postAddpanier(req, res) {
  try {
    const { id_utilisateur, id_article, nombre_article } = req.body;

    if (!id_utilisateur || !id_article || !nombre_article) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    
    const newPanier = await createPanier(id_utilisateur, id_article, nombre_article);
    
    res.status(201).json({
      message: "Article ajouté au panier avec succès",
      id_panier: newPanier.id_panier
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout au panier:", err.stack);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Tous les paniers d'un utilisateur
export async function getPaniersController(req, res) {
  try {
    const id_utilisateur = parseInt(req.params.id_utilisateur, 10);
    if (isNaN(id_utilisateur)) {
      return res.status(400).json({ error: 'id_utilisateur invalide' });
    }

    const paniers = await getPaniersByUserId(id_utilisateur);
    res.json({ paniers });
  } catch (err) {
    console.error("Erreur getPaniersController:", err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Un panier spécifique
export async function getPanierController(req, res) {
  try {
    const id_utilisateur = parseInt(req.params.id_utilisateur, 10);
    const id_panier = parseInt(req.params.id_panier, 10);

    if (isNaN(id_utilisateur) || isNaN(id_panier)) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const panier = await getPanierByIdAndUser(id_panier, id_utilisateur);
    if (!panier) return res.status(404).json({ error: 'Panier non trouvé' });

    res.json({ panier });
  } catch (err) {
    console.error("Erreur getPanierController:", err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function deletePanierAll(req, res) {
  try {
    const { id_utilisateur, id_article, nombre_article } = req.body;

    if (!id_utilisateur || !id_article || !nombre_article) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const deleted = await deletePanier(id_utilisateur, id_article, nombre_article);

    if (!deleted) {
      return res.status(404).json({ message: "Aucun panier trouvé pour ces critères" });
    }

    res.status(200).json({
      message: "Panier supprimé avec succès",
      deletedPanier: deleted
    });

  } catch (err) {
    console.error('Erreur deletePanierController:', err.stack);
    res.status(500).json({ error: "Erreur serveur" });
  }
}