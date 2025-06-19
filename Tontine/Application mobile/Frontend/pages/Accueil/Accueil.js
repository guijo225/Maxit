Page({
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
  