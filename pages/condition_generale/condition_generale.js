// pages/accueil/accueil.js
const app = getApp();
Page({
  data:{
    users:{},
    maxitid:app.globalData.maxitId,
  },

  onValider :function(){
    wx.request({
      url: `http://192.168.252.30:8000/api/users/${app.globalData.maxitId}`,
      method : "GET",
      success : (res) => {
        const users = res.data
            this.setData({
              users : users
            });
            console.log(users);

        
    wx.request({
        url: 'http://192.168.252.213:8000/api/inscription',
        method:"POST",
        data:users,
        success:(res)=>{
            console.log(res.data);
            wx.redirectTo({
              url: '/pages/accueil/accueil',
            })
        }
      })
      },
      fail: (err) => {
          console.error("Erreur requête API :", err);
        }
    })
    
  },
      
  next() {
    wx.navigateTo({
      url: '/pages/accueil/accueil',
    })
  },
    /**
     * Page initial data
     */
    

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