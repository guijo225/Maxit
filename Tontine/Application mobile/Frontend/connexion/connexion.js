// pages/connexion/connexion.js
Page({
    
    pageInscription : function(){
        wx.redirectTo({
          url: '/pages/inscription/inscription',
        })
    },
    /**
     * Page initial data
     */
    data: {
        identifiant : "" ,
        mot_de_passe : "" ,
    },

    onPseudoChange(e) {
        this.setData({ pseudo: e.detail.value });
      },
      onPasswordChange(e) {
        this.setData({ mot_de_passe: e.detail.value });
      },
    connexion(){
        wx.request({
          url: 'http://192.168.252.90:8000/api/login',
          header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          method: "POST",
          data: {
            identifiant: this.data.pseudo,
            mot_de_passe: this.data.mot_de_passe
          },
          success : (res) => {  
              console.log(res);       
                wx.showToast({
                  title: 'Connnexion effectué ✅',
                  icon : "none",
                })        
          },
          fail : (err) => {
            console.error("Erreur d'enregistrement" , err);
            wx.showToast({
              title: "Erreur d'enregistrement",
              icon : "error"
            });
            }
        })
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

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