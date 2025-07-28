// pages/message/message.js
Page({

  /**
   * Page initial data
   */
  data: {
    rating: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  onRate(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ rating: index + 1 })
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