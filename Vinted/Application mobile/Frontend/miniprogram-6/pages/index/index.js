Page({
  data: {
    rating: 0
  },
  onRate(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ rating: index + 1 })
  },
  addProduct() {
    wx.navigateTo({
      url: '/pages/formulaire/formulaire' // change selon la page cible
    });
  }
})
