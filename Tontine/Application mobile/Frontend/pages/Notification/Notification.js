Page({
    data: {
      notifications: []
    },
  
    onLoad: function () {
      this.getNotifications();
    },
  
    getNotifications: function () {
      let that = this;
      wx.request({
        url: 'http://192.168.252.30:3000/api/notification/notif', // remplace ici ton URL réelle
        method: 'GET',
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
          notifs.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
  
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
  
  



