// pages/integration_utilisateur/integration_utilisateur.js
Page({

    /**
     * Page initial data
     */
    data: {
      isExpanded: false,
    
    avisList: [
        {
          id: 1,
          avatar: '/assets/avatar.jpg',
          nom: 'Odi Mariano',
          note: '⭐⭐⭐⭐⭐',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          expanded: false,
          showButton: true
        },
        {
          id: 2,
          avatar: '/assets/avatar.jpg',
          nom: 'Marie Dubois',
          note: '⭐⭐⭐⭐',
          description: 'Excellent service, très satisfaite de mon achat. Je recommande vivement cette application à tous mes amis et ma famille. L\'expérience utilisateur est fantastique et l\'équipe support est très réactive.',
          expanded: false,
          showButton: true
        },
        {
          id: 3,
        avatar: '/assets/avatar.jpg',
          nom: 'Jean Martin',
          note: '⭐⭐⭐⭐⭐',
          description: 'Parfait !',
          expanded: false,
          showButton: false
        }
      ]
    },
    /**
     * Lifecycle function--Called when page load
     */
    onLoad() {
   this.checkTextLength();
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
  
    },
    toggleText: function() {
      this.setData({
        isExpanded: !this.data.isExpanded
      });
    },
    checkTextLength() {
      const avisList = this.data.avisList.map(item => {
        // Si la description fait plus de 100 caractères, afficher le bouton
        item.showButton = item.description.length > 100;
        return item;
      });
      
      this.setData({
        avisList: avisList
      });
    },
      toggleExpand(e) {
      const index = e.currentTarget.dataset.index;
      const avisList = this.data.avisList;
      
      avisList[index].expanded = !avisList[index].expanded;
      
      this.setData({
        avisList: avisList
      });
      
      // Animation de scroll fluide si nécessaire
      if (avisList[index].expanded) {
        setTimeout(() => {
          wx.pageScrollTo({
            selector: `.avis-${index}`,
            duration: 300
          });
        }, 100);
      }
    },
    Integrer(){
      wx.redirectTo({
        url: '/pages/Accueil/Accueil',
      })
      
    }
  
  })