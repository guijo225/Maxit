// pages/PageContact/PageContact.js
Page({

  /**
   * Page initial data
   */
  data: {
contacts: [
        { id: 1, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 2, name: "Arouna Kone", phone: "+228 07481777" },
        { id: 3, name: "Anne Esther", phone: "+228 07481777" },
        { id: 4, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 5, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 6, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 7, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 8, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 9, name: "Angban Gpt", phone: "+228 07481777" },
        { id: 10, name: "Angban Gpt", phone: "+228 07481777" }
      ].map(item => ({ ...item, selected: false })), // Ajout de la propriété "selected" pour chaque contact
      multiSelect: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
   toggleMultiSelect() {
      this.setData({
        multiSelect: !this.data.multiSelect // Inverse l'état du mode multi-sélection
      });
      // Réinitialise la sélection si le mode est désactivé
      if (!this.data.multiSelect) {
        this.setData({
          contacts: this.data.contacts.map(item => ({ ...item, selected: false }))
        });
      }
    },
  
  
    // Gérer la sélection d'un contact
    selectContact(e) {
      if (this.data.multiSelect) { // Vérifie si le mode multi-sélection est activé
        const index = e.currentTarget.dataset.index; // Récupère l'index du contact cliqué
        const contacts = this.data.contacts;
        contacts[index].selected = !contacts[index].selected; // Inverse l'état de sélection
        this.setData({
          contacts: contacts // Met à jour la liste des contacts
        });
      }
    },
  
  
    // Retourner en arrière (action de l'icône)
    goBack() {
      wx.navigateTo({
        url: '/pages/index/index',
      }); // Retourne à la page précédente
    },
  
  
    // Naviguer vers une autre page en cliquant sur "Ignorer"
    navigateAway() {
      wx.navigateTo({
        url: '/pages/Accueil/Accueil' 
      });
    },
})