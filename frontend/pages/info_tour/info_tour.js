// pages/Tour/Tour.js
const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        tontine:'',
        result:'',
        showError:'',
        errorMessage:'',
        visible: true,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        if(options.data) {
            try {
                const data = JSON.parse(decodeURIComponent(options.data))
                console.log(data)
                this.setData({tontine:data});
                this.getDataTour(data.tontine.id_tontine)
            } catch (error) {
                console.error('Erreur transfert de données:', error);
                this.setData({
                    showError: true,
                    errorMessage: 'Problème de connexion lors de la navigation des données.'
                });
            }
        }
        this.onRefresh = () => {
            this.setData({ showError: false });
            this.getDataTour(this.data.tontine.id_tontine);
        };
    },

    getDataTour(id_tontine) {
        wx.request({
            url:`${app.globalData.url_laravel}/api/tontine/${id_tontine}`,
            method: 'GET',
            success: (res) => {
              const result = res.data;
                console.log(result);
              this.setData({
                result:result,
                visible: false,
              });
            },
            fail:(err) => {
              console.error('Erreur chargement membres :', err);
              this.setData({
                  showError: true,
                  errorMessage: 'Problème de chargement des informations du tour.'
              });
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