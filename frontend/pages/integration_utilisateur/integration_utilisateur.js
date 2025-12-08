const app = getApp();
// Gestion de la logique de la page
Page({
    /**
     * Données initiales de la page
     */
    data: {
        isExpanded: false,
        showModal: false,
        showError:'',
        formData: {
            code: '' // Champ pour le mot de passe
        },
        avisList: [
            {
                id: 1,
                avatar: '../../images/avatar.jpg',
                nom: 'Odi Mariano',
                note: '⭐⭐⭐⭐⭐',
                description: 'Enfin une application simple et efficace pour gérer notre tontine ! Tout est transparent, je vois directement qui a cotisé et quand. On reçoit même des rappels automatiques pour ne rien oublier. Ça nous évite les disputes et rend l’épargne beaucoup plus facile !',
                expanded: false,
                showButton: true
            },
            {
                id: 2,
                avatar: '../../images/avatar.jpg',
                nom: 'Marie Dubois',
                note: '⭐⭐⭐⭐',
                description: 'Franchement je recommande ! Avant on utilisait juste un cahier, maintenant tout est digitalisé. Les paiements sont sécurisés et rapides, et je peux suivre ma progression en temps réel. L’application nous fait gagner du temps et donne confiance à tous les membres.',
                expanded: false,
                showButton: true
            },
            {
                id: 3,
                avatar: '../../images/avatar.jpg',
                nom: 'Jean Martin',
                note: '⭐⭐⭐⭐⭐',
                description: "J’adore cette application ! Elle nous permet de gérer plusieurs tontines en même temps, même à distance. Je peux participer avec mes amis qui ne vivent pas dans la même ville, et tout est bien organisé. C’est moderne, pratique et rassurant.",
                expanded: false,
                showButton: false
            }
        ],
        otp: '',
        idUser:'',
        numeroTelephone:''
    },

    onLoad(options) {
        this.setData({idUser:app.globalData.utilisateur.id_utilisateur});
        this.checkTextLength();
    },

    onPhoneNumberInput: function(e) {
        this.setData({
            numeroTelephone:e.detail.value
        })
    },

    onOtpInput: function(e) {
        const field = e.currentTarget.dataset.field;
        let value = e.detail.value;
        // Restreindre aux nombres uniquement
        value = value.replace(/[^0-9]/g, '').slice(0, 6); // Max 6 chiffres
        this.setData({
            otp: value
        });
    },

    verifyOtp() {
        const {numeroTelephone, otp} = this.data;
        if (!numeroTelephone || !otp) {
            console.log("Veuillez entrer votre numéro et le code otp", 'error');
            return;
        }
        console.log("Vérification de l'otp", 'info');
        wx.request({
          url: `${app.globalData.url_node}/verify-otp`,
          method: 'POST',
          header: {
              'Content-Type' : 'application/json'
          },
          data: {
              numeroTelephone: numeroTelephone,
              otp: otp, 
              idUser: app.globalData.utilisateur.id_utilisateur
          },
          success: (res) => {
            if (res.statusCode === 200) {
                wx.showToast({
                    title: 'OTP vérifié avec succès!',
                    icon: 'success'
                  });
                  setTimeout(() => {
                    const data = res.data;
                    const encodedData = encodeURIComponent(JSON.stringify(data))
                    wx.navigateTo({
                        url: `/pages/PageGestion/PageGestion?data=${encodedData}`,
                    });
                }, 500);
                } else {
                console.log(`Erreur: ${res.data.message || "OTP invalide ou expiré"}`, 'error')
                wx.showModal({
                  title: 'Erreur',
                  content: 'OTP invalide ou expiré',
                  confirmText:'OK',
                  cancelText: 'Retour', 
                  complete: (res) => {
                    if (res.cancel) {
                      wx.navigateBack()
                    }
                    if (res.confirm) {
                      
                    }
                  }
                })
            }
        },
        fail: (err) => {
            console.error('Erreur réseau verify-otp:', err);
            this.setData({
                showError: true,
                errorMessage: 'Problème de connexion lors de la vérification du code otp.'
            });
        }
        });
    },

    /**
     * Ouvre la modal
     */
    openModal() {
        this.setData({ showModal: true });
    },

    /**
     * Ferme la modal
     */
    closeModal() {
        this.setData({ 
            showModal: false,
            formData: { code: '' } // Réinitialise le champ
        });
    },

    /**
     * Gère les changements dans le champ de saisie
     */
    /*onInputChange(e) {
        const field = e.currentTarget.dataset.field;
        let value = e.detail.value;
        // Restreindre aux nombres uniquement
        value = value.replace(/[^0-9]/g, '').slice(0, 6); // Max 6 chiffres
        this.setData({
            [`formData.${field}`]: value
        });
    },*/

    /**
     * Confirme l'action de la modal
     */
    confirmModal() {
        // Logique pour gérer l'envoi du mot de passe
        console.log('Mot de passe soumis : ', this.data.formData.code);
        this.closeModal();
    },

    /**
     * Charge la page
     */

    /**
     * Vérifie la longueur des textes des avis
     */
    checkTextLength() {
        const avisList = this.data.avisList.map(item => {
            item.showButton = item.description.length > 100;
            return item;
        });
        this.setData({ avisList });
    },

    /**
     * Bascule l'affichage du texte
     */
    toggleText() {
        this.setData({
            isExpanded: !this.data.isExpanded
        });
    },

    /**
     * Bascule l'affichage des avis
     */
    toggleExpand(e) {
        const index = e.currentTarget.dataset.index;
        const avisList = this.data.avisList;
        avisList[index].expanded = !avisList[index].expanded;
        this.setData({ avisList });
        if (avisList[index].expanded) {
            setTimeout(() => {
                wx.pageScrollTo({
                    selector: `.avis-${index}`,
                    duration: 300
                });
            }, 100);
        }
    },

    /**
     * Redirige vers la page d'accueil
     */
    Integrer() {
        wx.redirectTo({
            url: '/pages/PageGestion/PageGestion',
        });
    },

    preventClose() {

    }
});