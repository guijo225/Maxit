// pages/historique/historique.js

const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
      tontines : [] ,
      users :  {},
        loaded : false,
        id : 13
    },

    
    CreeTontine :function(){
      wx.navigateTo({
        url: '/pages/creation_tontine/creation_tontine',
      })
    },

    /*IntegreTontine :function(e){
        const tontine = e.currentTarget.dataset.tontine;
        const iduser = e.currentTarget.dataset.users;
        wx.navigateTo({
          url: '/pages/integration_utilisateur/integration_utilisateur',
          success(res) {
              res.eventChannel.emit('sendDataToDetail', tontine, iduser)
          }
        })
      },*/

    IntegreTontine :function(e){
        //const idUser = e.currentTarget.dataset.users.id_utilisateur;
        const idUser = this.data.users.id_utilisateur;
        wx.navigateTo({
          url: '/pages/integration_utilisateur/integration_utilisateur',
          success(res) {
                res.eventChannel.emit('sendDataToDetail', idUser)
            }
        })
      },

    NavPageGestion :function(e){
        const tontine = e.currentTarget.dataset.tontine;
        const idUser = this.data.users.id_utilisateur;
        const data = {idUser, tontine}
        wx.navigateTo({
          url: '/pages/PageGestion/PageGestion',
          success(res) {
              res.eventChannel.emit('sendDataToDetail', data)
          }
        })
      },
        
    

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        const userId = app.globalData.maxitId;
        
        wx.request({
          url: `http://192.168.252.213:8000/api/login/${userId}`,
          method: "GET",
          success: (res) => {
            if (res.data.success && res.data.utilisateur) {
              const utilisateur = res.data.utilisateur;
      
              this.setData({
                users: utilisateur
              });
      
              console.log("Utilisateur ID:", utilisateur.id_utilisateur);
      
              wx.request({
                url: 'http://192.168.252.213:3000/first/afficher',
                method: "GET",
                data: {
                  id: utilisateur.id_utilisateur
                },
                success: (res2) => {
                  console.log("Tontines reçues:", res2.data);
      
                  this.setData({
                    tontines: Array.isArray(res2.data) ? res2.data : [],
                    loaded: true
                  });
                },
                fail: (err) => {
                  console.error("Erreur requête API (afficher) :", err);
                }
              });
      
            } else {
              wx.redirectTo({
                url: '/pages/condition_generale/condition_generale',
              });
            }
          },
          fail: (err) => {
            console.error("Erreur requête API (login) :", err);
          }
        });
      },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {

    }
})