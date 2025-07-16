Page({
    data: {
      id_utilisateur: 1, // 🔁 à récupérer depuis globalData ou localStorage
      articles: []
    },
  
    chargerArticles() {
      wx.request({
        url: 'http://192.168.252.65:3000/profil/articles',
        method: 'POST',
        data: {
          id_utilisateur: this.data.id_utilisateur
        },
        success: (res) => {
          this.setData({
            articles: res.data
          });
        },
        fail: (err) => {
          wx.showToast({ title: 'Erreur serveur', icon: 'none' });
          console.error(err);
        }
      });
    }
  });