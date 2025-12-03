Page({
    data: {
      errorMessage: 'Une erreur de connexion est survenue. Veuillez réessayer.',
    },
  
    handleRefresh() {
      // Logique pour actualiser (par exemple, relancer la requête réseau)
      wx.showToast({
        title: 'Actualisation en cours...',
        icon: 'loading',
        duration: 2000
      });
      // Exemple : Rediriger vers la page principale ou relancer une requête
      wx.reLaunch({
        url: '/pages/index/index' // Remplacez par la page cible
      });
    },
  
    handleGoBack() {
      // Logique pour revenir en arrière
      wx.navigateBack({
        delta: 1 // Revenir à la page précédente
      });
    }
  });