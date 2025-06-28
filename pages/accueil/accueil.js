// pages/historique/historique.js

const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
      tontines : [] ,
      users : [] ,
        loaded : false,
        id : 20
    },

    
    CreeTontine :function(){
      wx.navigateTo({
        url: '/pages/creation_tontine/creation_tontine',
      })
    },
        
    

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        wx.request({
            url: 'http://192.168.252.213:3000/first/afficher',
            method : "GET" ,
            data:{id:1},
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

          
        /*wx.request({
          url: `http://192.168.252.213:8000/api/login/${app.globalData.maxitId}`,
          method : "GET" ,
          success : (res) => {
            console.log(res.data);
            if(res.data.success){
            setTimeout(() => {
                this.setData({
                  users : res.data
                });
            })  

            }else{
              wx.redirectTo({
                url: '/pages/accueil/accueil',
              })
            }
          },
          fail: (err) => {
              console.error("Erreur requête API :", err);
            }
        })*/

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