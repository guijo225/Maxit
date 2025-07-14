// pages/Tour/Tour.js
const app = getApp();
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
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('sendDataToDetail', (data) => {
            console.log(data);
            this.setData({tontine:data});
            //tontine = data;
            wx.request({
                url:`http://192.168.252.43:8000/api/tontine/${data.tontine.id_tontine}`,
                method: 'GET',
                success: (res) => {
                  const result = res.data;
                    console.log(result);
                  this.setData({
                    result
                  });
                },
                fail:(err) => {
                  console.error('Erreur chargement membres :', err);
                }
              });
        });
        //this.infoTontine();
    },

    /*infoTontine () {
        wx.request({
          url: 'http://192.168.252.43:8000/api/tontine/14',
          method: 'GET',
          success: (res) => {
              const result = res.data;
              this.setData({
                result
              });
          },
          fail:(err) => {
              console.error('Erreur de chargement :', err)
          }
        })
    },*/

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