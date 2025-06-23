Page({

    data: {
        showModalPaie : false ,
        modalVisiblePaie: false,
        montant : 1,
        contact : "" ,
    },

    lancerPaiement(){
        this.openModalPaie();
        this.info_paiement();
    },

    openModalPaie() {
        this.setData({ showModalPaie: true });
        setTimeout(() => {
          this.setData({ modalVisiblePaie: true });
        }, 50);
      },
    
      closeModalPaie() {
        this.setData({ modalVisiblePaie: false });
        setTimeout(() => {
          this.setData({ showModalPaie: false });
        }, 300); 
      },

      //Fonction pour recup et afficher les valeurs de la bd (montant,contact)
      info_paiement(){
        wx.request({
          url: 'http://192.168.252.118:8000/infos_paiement/id_user:1/id_tontine:1',
          method : "GET",
          success : (res) => {
              const result = res.data ;
              this.setData({
                  montant : result[0], 
                  contact : result[1],
              });
             /* console.log(result);
              setTimeout(() =>{
                  console.log(this.data.montant) 
              }, 100);
              */
          },
          fail : (err) =>{
              console.error("Erreur de paiement " , err);
              wx.showToast({
                title: 'Erreur de paiement',
                icon : "error"
              });
          }
        })
      },

      
      paiement(){
        const montant = this.data.montant ;
        wx.request({
          url: 'http://192.168.252.118:8000/cotisation-tontine/${montant}',
          method : "POST",
          header: { 'content-type': 'application/json' } ,
          data : {montant}, 
          success : (res) => {
              console.log("Montant :", montant);
              if (res.statusCode === 200) {
                wx.showToast({
                  title: 'Paiement réussi',
                  icon: "success"
                });
              }
          },
        })
      },


    goBack() {
      wx.navigateBack();
    },
    // Méthode pour naviguer vers la page d'invitation
    goToInvite() {
      wx.navigateTo({
        url: '/pages/Invite/Invite'
      });
    },
    goToCotisation() {
      wx.navigateTo({
        url: '/pages/Cotisation/Cotisation'
      });
    },
    goToNotification() {
        wx.navigateTo({
          url: '/pages/Notification/Notification'
        });
      },
    goToTour() {
      wx.navigateTo({
        url: '/pages/Tour/Tour'
      });
    },
    goToHistorique() {
      wx.navigateTo({
        url: '/pages/Historique/Historique'
      });
    },
    openModal() {
        this.setData({ showModal: true });
      },
    
      closeModal() {
        this.setData({ showModal: false });
      },

      openModalConsultation() {
        this.setData({ showModalConsultation: true });
      },
    
      closeModalConsultation() {
        this.setData({ showModalConsultation: false });
      },

      openModalHistorique() {
        this.setData({ showModalHistorique: true });
      },
    
      closeModalHistorique() {
        this.setData({ showModalHistorique: false });
      },

      preventClose(){
      },

      Modif() {
        //Navigation
        wx.redirectTo({
          url: '/pages/index/index',
        })
      },
  })
  