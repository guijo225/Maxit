const API_URL = 'http://192.168.252.43:3000';
const app = getApp();
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
      multiSelect: false, // État du mode multi-sélection
      numeroTelephone:'',
      tontine:'',
      recipients:[]
    },
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('sendDataToDetail', (data) => {
            console.log(data);
            this.setData({tontine:data});
        });
    },

    onPhoneNumberInput: function(e) {
        this.setData({
            numeroTelephone:e.detail.value
        })
    },

    // Api d'envoie d'otp
    sendOtp(e){
        const {numeroTelephone, name} = this.data;
        if (!numeroTelephone) {
            //this.showMessage("Veuillez sélectionner ou saisir au moins un contact", 'error');
            console.log("Veuillez sélectionner ou saisir au moins un contact", 'error')
            return;
        }

        //this.showMessage('Envoi des invitations...', 'info');
        console.log('Envoi des invitations...', 'info')

        const recipients = [{numeroTelephone: numeroTelephone, name: name || 'Invité'}]
        const id_tontine = this.data.tontine;
        wx.request({
            url: `http://192.168.252.43:3000/send-otp`,
            method: 'POST',
            header: {
                'Content-Type':'application/json'
            },
            data: {
                recipients: recipients,
                id_tontine: id_tontine
            },
            succes: (res) => {
                if (res.statusCode === 200) {
                    const firstResult = res.data.results[0];
                    let msg = 'Invitations envoyées !';
                    if (firstResult && firstResult.status === 'success') {
                        msg =+ `Lien d'invitation: ${firstResult.invitationlink}`;
                    };
                    wx.navigateTo({
                        url: '/pages/PageGestion/PageGestion'
                      });
                    //this.showMessage(msg, 'success');
                    console.log(msg, 'success')
                } else {
                    //this.showMessage(`Erreur: ${res.data.message || "Problème lors de l'envoi des invitations"}`, 'error')
                    console.log(`Erreur: ${res.data.message || "Problème lors de l'envoi des invitations"}`, 'error')
                }
            },
            fail: (err) => {
                console.error('Erreur réseau sendOtp:', err);
                //this.showMessage('Échec de la connexion au serveur.', 'error');
            }
        });
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
        url: '/pages/PageGestion/PageGestion'
      }); 
    },
  
    /**
     * Retourne à la page précédente
     */
    goBack() {
      wx.navigateTo({
        url: '/pages/creation_tontine/creation_tontine'
      });
    },
  
    /**
     * Navigue vers la page d'accueil en cliquant sur "Ignorer"
     */
    navigateAway() {
      wx.navigateTo({
        url: '/pages/PageGestion/PageGestion'
      });
    },
  
    /**
     * Lifecycle function--Called when page load
     */
  
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