// pages/historique/historique.js
const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        tontines : [] ,
        loaded : false
    },

    
        
    

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        wx.request({
            url: `${app.globalData.url_node}/first/afficher`,
            method : "GET" ,
            success : (res) => {
              console.log(res.data); 
              setTimeout(() => {
                  this.setData({
                      tontines : res.data ,
                      loaded: true 
                  });
              }, 2000)    
            },
            fail: (err) => {
                console.error("Erreur requête API :", err);
              }
          })
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