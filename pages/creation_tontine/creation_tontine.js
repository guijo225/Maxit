// index.js
const app = getApp();
Page({

    data: {
        swiperCurrent: 0,
        expanded: false,
        isApproved: false,
        showModal: false,
      users :  {},
  
        formData: {
            nom: '',
            description: '',
            type_tontine: '',
            regles: '',
            montant: '',
            frequence: '',
            participants: '',
            date_echeance: ''
        },
  
        // Liste des fréquences possibles
        frequenceOptions: ['Hebdomadaire', 'Quinzaine', 'Mensuelle', 'Deux mois', 'Trimestrielle'],
        // Liste des rappels possibles
        rappelOptions: ['1 jours avant', '2 jours avant', '3 jours avant', '4 jours avant', '5 jours avant'],
        // Liste des fréquences possibles
        type_tontine: ['Tontine sans assurance', 'Tontine avec assurance', 'Tontine inversée']
    },
    onLoad(options){

        const userId = app.globalData.maxitId;
        
        wx.request({
          url: `http://192.168.252.213:8000/api/login/${userId}`,
          method: "GET",
          success: (res) => {
            if (res.data.success && res.data.utilisateur) {
              const utilisateur = res.data.utilisateur;
              this.setData({
                users: utilisateur
              });
              console.log("Utilisateur :", utilisateur);
      
            } else {
              wx.redirectTo({
                url: '/pages/condition_generale/condition_generale',
              });
            }
          },
          fail: (err) => {
            console.error("Erreur requête API (login) :", err);
          }
        });
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

    // Ouvre le sélecteur de fréquence via wx.showActionSheet
    openTypeTontineOptions() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.type_tontine, // options à afficher
            success(res) {
                // si l'utilisateur sélectionne une option
                const selected = that.data.type_tontine[res.tapIndex];
                that.setData({
                    'formData.type_tontine': selected
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
    confirmModal() {
      const { formData } = this.data;
  
      // Vérification locale des champs requis
      if (!formData.nom || !formData.type_tontine || !formData.montant || !formData.frequence || !formData.participants || !formData.date_echeance) {
        wx.showToast({
          title: 'Champs requis manquants',
          icon: 'none'
        });
        return;
      }
      //console.log(this.users)
      // Ajout de l'id fictif dans les données envoyées
      const formDataWithId = {
        ...formData,
        id_utilisateur: this.data.users.id_utilisateur
      };
  
      console.log('Données envoyées :', formDataWithId);
  
      wx.showLoading({
        title: 'Création...',
        mask: true
      });
  
      wx.request({
        url: 'http://192.168.252.213:3000/first',
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
            console.log(res);
  
            setTimeout(() => {
                const data = res.data;
              wx.navigateTo({
                url: '/pages/PageContact/PageContact',
                success(res) {
                  wx.hideLoading();
                  res.eventChannel.emit('sendDataToDetail', data)
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
  ,
    preventClose(){
    },

    navigation() {

        wx.navigateTo({
          url: '/pages/PageContact/PageContact',
        })
    }
  
  })