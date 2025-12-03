// pages/a_propos/a_propos.js
Page({

    /**
     * Page initial data
     */
    data: {
        showValeurs : false ,
        showVision : false ,
        showMission : false
    },
    toggleValeurs() {
        this.setData({
          showValeurs: !this.data.showValeurs
        })
      },
      toggleMission() {
        this.setData({
            showMission: !this.data.showMission
        })
      },
    toggleVision() {
        this.setData({
          showVision: !this.data.showVision
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