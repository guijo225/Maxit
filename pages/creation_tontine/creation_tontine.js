// index.js
Page({

    data: {
        swiperCurrent: 0,
        expanded: false,
        isApproved: false,
        showModal: false,
  
        formData: {
            nom: '',
            description: '',
            regles: '',
            montant: '',
            frequence: '',
            participants: '',
            date_echeance: ''
        },
  
        // Liste des fréquences possibles
        frequenceOptions: ['Mensuelle', 'Hebdomadaire', 'Quinzaine', 'Année'],
  
        // Liste des rapelle possibles
        rappelOptions: ['1 jours avant', '2 jours avants', '3 jours avant', '4 jours avant', '5 jours avant']
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
                            duration: 20
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
        if (!this.data.isApproved) return;
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
  
    // Ouvre le sélecteur de rapelle via wx.showActionSheet
    openRappelOptions() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.rappelOptions, // options à afficher
            success(res) {
                // si l'utilisateur sélectionne une option
                const selected = that.data.rappelOptions[res.tapIndex];
                that.setData({
                    'formData.date_echeance': selected
                });
            },
            fail(err) {
                console.log('Annulé ou erreur', err);
            }
        });
    },
  
    // Validation et navigation vers une autre page
    /*confirmModal() {
      const { formData } = this.data;
  
      // Vérification locale des champs requis
      if (!formData.nom || !formData.montant || !formData.frequence || !formData.participants || !formData.date_echeance) {
        wx.showToast({
          title: 'Champs requis manquants',
          icon: 'none'
        });
        return;
      }
  
      // Ajout de l'id fictif dans les données envoyées
      const formDataWithId = {
        ...formData,
        id: 1 // ID fictif du créateur
      };
  
      console.log('Données envoyées :', formDataWithId);
  
      wx.showLoading({
        title: 'Création...',
        mask: true
      });
  
      wx.request({
        url: 'http://192.168.252.236:3000/first',
        method: 'POST',
        data: formDataWithId,
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          if (res.statusCode === 201) {
            wx.showToast({
              title: 'Tontine créée',
              icon: 'success'
            });
            console.log('Bravo');
  
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/PageContact/PageContact',
                success() {
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
            }, 500);
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.data.error || 'Erreur API',
              icon: 'none'
            });
          }
        },
        fail(err) {
          wx.hideLoading();
          console.error('Erreur réseau :', err);
          wx.showToast({
            title: 'Erreur réseau',
            icon: 'none'
          });
        }
      });
    }
  ,*/
    preventClose(){
    },

    navigation() {
        wx.navigateTo({
          url: '/pages/PageContact/PageContact',
        })
    }
  
  })