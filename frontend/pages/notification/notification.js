const app = getApp();
Page({
  data: {
    notifications: [],
    donnee: {}
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendDataToDetail', (data) => {
      console.log('Données reçues :', data);
      this.setData({
        donnee: data
      }, () => {
        this.getNotifications();
      });
    })
  },

  getNotifications() {
    let that = this;
    console.log("donnee:", this.data.donnee);
    if (!this.data.donnee || !this.data.donnee.tontine) {
      console.error("donnee ou tontine est undefined");
      return;
    }
    const data = {
      id_utilisateur: this.data.donnee.idUser,
      id_tontine: this.data.donnee.tontine.id_tontine
    }
    wx.request({
      url: `http://${app.globalData.url_diack}:8000/api/getNotificationsTontine`,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('Résultat de l\'API:', res.data);

        // Récupère le tableau
        let notifs = res.data.data;

        // Ajoute une propriété heure à chaque notification
        notifs = notifs.map(item => {
          item.heure = item.date_creation.substring(11, 16); // extrait HH:MM
          return item;
        });

        // On trie de la plus récente à la plus ancienne (optionnel)
        //notifs.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));

        that.setData({
          notifications: notifs
        });
      },
      fail: function (error) {
        console.error('Erreur API:', error);
      }
    });
  }
});