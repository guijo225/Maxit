// pages/PageContact/PageContact.js
Page({
    /**
     * Données initiales de la page
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
      multiSelect: false // État du mode multi-sélection
    },
  
    /**
     * Active ou désactive le mode multi-sélection
     */
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
  
    /**
     * Gère la sélection d'un contact en mode multi-sélection
     */
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
  
    /**
     * Récupère les contacts sélectionnés et navigue vers une autre page
     */
    addSelectedContacts() {
      const selectedContacts = this.data.contacts.filter(item => item.selected); // Récupère les contacts sélectionnés
      if (selectedContacts.length === 0) {
        wx.showToast({
          title: 'Aucun contact sélectionné',
          icon: 'none'
        });
        return;
      }
      // Stocke les contacts sélectionnés dans le stockage local
      wx.setStorageSync('selectedContacts', selectedContacts);
      // Navigue vers la page cible
      wx.navigateTo({
        url: '/pages/Accueil/Accueil'
      });
    },
  
    /**
     * Retourne à la page précédente
     */
    goBack() {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    },
  
    /**
     * Navigue vers la page d'accueil en cliquant sur "Ignorer"
     */
    navigateAway() {
      wx.navigateTo({
        url: '/pages/Accueil/Accueil'
      });
    },
  
    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {},
  
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
    onUnload() {},
  
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