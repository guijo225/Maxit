Page({
  data: {
    quantite: 1 // quantité par défaut
  },

  // Augmenter la quantité
  augmenter() {
    this.setData({
      quantite: this.data.quantite + 1
    });
  },

  // Diminuer la quantité
  diminuer() {
    if (this.data.quantite > 1) { // éviter de descendre en dessous de 1
      this.setData({
        quantite: this.data.quantite - 1
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
