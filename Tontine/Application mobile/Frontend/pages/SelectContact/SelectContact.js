// pages/SelectedContacts/SelectedContacts.js
Page({
    /**
     * Données initiales de la page
     */
    data: {
      selectedContacts: [] // Liste des contacts sélectionnés
    },
  
    /**
     * Lifecycle function--Called when page load
     */
    onLoad() {
      // Récupère les contacts sélectionnés depuis le stockage local
      const selectedContacts = wx.getStorageSync('selectedContacts') || [];
      this.setData({
        selectedContacts: selectedContacts // Met à jour les données pour l'affichage
      });
    },
  
    /**
     * Retourne à la page précédente
     */
    goBack() {
      wx.navigateBack({
        delta: 1 // Retourne à la page précédente
      });
    },
  
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {},
  
    /**
     * Lifecycle function--Called when page show
     */
    onShow() {},
  
    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {},
  
    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {
      // Optionnel : Supprime les contacts sélectionnés du stockage local si nécessaire
      wx.removeStorageSync('selectedContacts');
    },
  
    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {},
  
    /**
     * Called when page reach bottom
     */
    onReachBottom() {},
  
    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {}
  })