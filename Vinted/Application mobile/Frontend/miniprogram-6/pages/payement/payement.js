Page({
  data: {
    quantite: 1,      // quantité  d'un maillot  par défaut
    prixUnitaire: 15000, // prix pour d'un maillot unité
    prixTotal: 15000  // prix affiché
  },

  // Augmenter la quantité
  augmenter() {
    let qte = this.data.quantite + 1;
    this.setData({
      quantite: qte,
      prixTotal: qte * this.data.prixUnitaire
    });
  },

  // Diminuer la quantité
  diminuer() {
    if (this.data.quantite > 1) {
      let qte = this.data.quantite - 1;
      this.setData({
        quantite: qte,
        prixTotal: qte * this.data.prixUnitaire
      });
    }
  },
  confirmAchat() {
    wx.showToast({
      title: 'Achat confirmé',
      icon: 'success',
      duration: 2000
    });
    this.hideModal();
  },
  autre(){
    wx.navigateTo({
      url: 'pages/home/home',
    })
  }
});
