// pages/inscription/inscription.js
Page({

    pageConnexion : function(){
            wx.redirectTo({
              url: '/pages/connexion/connexion',
            })
        },
    

    /**
     * Page initial data
     */
    data: {
        imagePath: ''
    },
    chooseImage() {
        wx.chooseImage({
          count: 1, // nombre d’images à sélectionner
          sizeType: ['original', 'compressed'], // taille de l’image
          sourceType: ['album', 'camera'], // sources possibles
          success: (res) => {
            const path = res.tempFilePaths[0];
            this.setData({
              imagePath: path
            });
            console.log('Image sélectionnée :', path);
          },
          fail: (err) => {
            console.error('Erreur lors de la sélection de l’image', err);
          }
        });
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