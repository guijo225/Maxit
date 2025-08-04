Page({
  data: {
    showModal: false,
    articles: [
      { id: 1, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 2, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 3, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 4, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 5, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 6, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 7, name: "Maillot Barça", image: "/images/fc-barcelone.png" },
      { id: 8, name: "Maillot Barça", image: "/images/fc-barcelone.png" }
      ],
    scrollLeft: 0,
    scrollStep: 200
  },

  showModal() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false
    });
  },

  confirmAchat() {
    wx.showToast({
      title: 'Achat confirmé',
      icon: 'success',
      duration: 2000
    });
    this.hideModal();
  },
  deleteArticle: function(e) {
    const index = e.currentTarget.dataset.index;
    let articles = this.data.articles;
    articles.splice(index, 1);
    
    this.setData({
      articles: articles
    });
    
    wx.showToast({
      title: 'Article supprimé',
      icon: 'none',
      duration: 1000
    });
  },
  scrollLeft() {
    let newPos = this.data.scrollLeft - this.data.scrollStep;
    if (newPos < 0) newPos = 0;
    this.setData({
      scrollLeft: newPos
    });
  },

  scrollRight() {
    let newPos = this.data.scrollLeft + this.data.scrollStep;
    this.setData({
      scrollLeft: newPos
    });
  }
});