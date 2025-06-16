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
    }
  })
  