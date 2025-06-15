// index.js
Page({

  data: {
    swiperCurrent: 0,
    expanded:false,
    isApproved:false,
    showModal: false,
  
      formData: {
        nom: '',
        description: '',
        regles:'',
        montant: '',
        frequence: '',
        participants: ''
      },
  
      // Liste des fréquences possibles
      frequenceOptions: ['Mensuelle', 'Hebdomadaire', 'Quinzaine', 'Année']
  },
  
  onSwiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toggleExpanded() {
    const newState = !this.data.expanded;
    this.setData({
      expanded: newState
    }, () => {
      if (newState) {
      
        wx.createSelectorQuery().select('#footer').boundingClientRect(rect => {
          if (rect) {
            wx.pageScrollTo({
              scrollTop: rect.top + wx.getSystemInfoSync().windowScrollY,
              duration:20
            });
          }
        }).exec();
      }
    });
  },
   toggleApproval() {
    this.setData({
      isApproved: !this.data.isApproved
    })
  },
 Slide(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentSlide: index
    });
  },
   openModal() {
      this.setData({ showModal: true });
    },
  
    closeModal() {
      this.setData({ showModal: false });
    },
  
    onInputChange(e) {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
      this.setData({
        [`formData.${field}`]: value
      });
    },
  
    // Ouvre le sélecteur de fréquence via wx.showActionSheet
    openFrequenceOptions() {
      const that = this;
      wx.showActionSheet({
        itemList: this.data.frequenceOptions, // options à afficher
        success(res) {
          // si l'utilisateur sélectionne une option
          const selected = that.data.frequenceOptions[res.tapIndex];
          that.setData({
            'formData.frequence': selected
          });
        },
        fail(err) {
          console.log('Annulé ou erreur', err);
        }
      });
    },
  
    // Validation et navigation vers une autre page
    confirmModal() {
      const that = this;

      // Affiche un loader système natif pendant la transition
      wx.showLoading({
          mask: true // Empêche de cliquer derrière pendant le chargement
      });

      // Petit délai pour laisser le loader visible avant de naviguer
      setTimeout(() => {
          // Navigation propre sans empilement de pages superflues
          wx.redirectTo({
              url: '/pages/PageContact/PageContact',
              success() {
                  // Optionnel : on peut cacher le loader ici mais la page sera détruite donc pas nécessaire
                  wx.hideLoading();
              },
              fail(err) {
                  console.error('Erreur de navigation :', err);
                  wx.hideLoading();
                  wx.showToast({
                      title: 'Erreur de navigation',
                      icon: 'none'
                  });
              }
          });
      },1); // délai ajustable (300-500 ms pour un effet fluide)
  }

})