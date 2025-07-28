Page({
  data: {
    currentTime: '',
    searchQuery: '',
    isFocused: false
  },

  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    });
  },
  onFocus(){
    this.setData({
      isFocused: true
    })
  },
  onBlur(){
    this.setData({
      isFocused: false
    })
  },

  onLoad() {
    this.updateTime(); // mettre à jour une première fois

    // Mettre à jour l'heure chaque minute (optionnel)
    this.timer = setInterval(this.updateTime, 60000);
  },

  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  onUnload() {
    clearInterval(this.timer); // Arrêter le timer si on quitte la page
  },
  Overpage() {
    wx.navigateTo({
      url: '/pages/message/message',
      success: () => {
        wx.redirectTo({
          url: '/pages/messagevendeur/messagevendeur',
        });
      }
    });
  }
});
