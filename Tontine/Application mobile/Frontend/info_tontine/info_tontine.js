// index.js
Page({
  data: {
  },

  onLoad(){
    this.chargePage();
  },

  chargePage() {
    wx.request({
      url:'http://192.168.252.43:8000/api/tontine/3',
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
  },
  chargeParticipant(){
    wx.request({
      url: 'http://192.168.252.43:8000/api/tontine/3',
    })
  }
})
