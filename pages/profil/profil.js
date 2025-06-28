// pages/profil/profil.js
Page({

    /**
     * Page initial data
     */
    data: {
  
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
  
    },

    goToInfo() {
        wx.navigateTo({
          url: '/pages/mes_informations/mes_informations',
        })
    },

    goToAssistance() {
        wx.navigateTo({
          url: '/pages/assistance/assistance',
        })
    },

    goToAbout() {
        wx.navigateTo({
          url: '/pages/a_propos/a_propos',
        })
    },

    goToTontines() {
        wx.navigateTo({
          url: '/pages/accueil/accueil',
        })
    }
  })