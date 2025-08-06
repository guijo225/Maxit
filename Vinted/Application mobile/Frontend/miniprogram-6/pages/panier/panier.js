Page({
  data: {
    cart: [],       // Le panier vide au départ
    total: 0 ,      // Total initialisé à 0      
  },
  allerVersPage() {
    wx.navigateTo({
      url: '/pages/accueil/accueil' // je dois remplace par le chemin réel de ma page
    });
  },

  // Fonction pour ajouter dynamiquement un article
  ajouterAuPanier(nouvelArticle) {
    const cart = this.data.cart.concat(nouvelArticle); // Ajout de l'article
    const total = cart.reduce((sum, item) => sum + item.prix, 0); // Calcul du total

    this.setData({
      cart: cart,
      total: total
    });
  },
});
