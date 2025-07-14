const app = getApp();
Page({

    data: {
        showModalPaie : false ,
        modalVisiblePaie: false,
        donnee: {},
        numeroTelephone:'',
        isAdmin: false,
        recipients: [],
        loaded: false
    },

    onLoad(options){
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendDataToDetail', (data) => {
        console.log(data);
        this.setData({donnee:data});
        if (data.tontine.role_utilisateur === "admin") {
            this.setData({
                isAdmin:true
            })
            //isAdmin = true
        }else{
            this.setData({isAdmin:false})
        }
        //tontine = data;
        wx.request({
            url: `http://192.168.252.43:8000/api/tour/${data.tontine.id_tontine}`,
            method : "GET", 
            success : (res) => {
                const info = res.data;
                this.setData ({
                    info,
                    loaded: true
                })
                console.log(info)
            },
            fail : (err) =>{
                console.error("Erreur de paiement " , err);
                wx.showToast({
                  title: 'Erreur de paiement',
                  icon : "error"
                });
            }
          })
    })
          
    },

    lancerPaiement(){
        this.openModalPaie();
        this.info_paiement();
    },

    openModalPaie() {
        this.setData({ showModalPaie: true });
        setTimeout(() => {
          this.setData({ modalVisiblePaie: true });
        }, 50);
      },
    
      closeModalPaie() {
        this.setData({ modalVisiblePaie: false });
        setTimeout(() => {
          this.setData({ showModalPaie: false });
        }, 300); 
      },
      //Fonction pour recup et afficher les valeurs de la bd (montant,contact)
      info_paiement(){
        const id = this.data.donnee.tontine.id_tontine
        const idUser = this.data.donnee.idUser
        console.log(id)
        console.log(idUser)
        wx.request({
          url: `http://192.168.252.207:8000/infos_paiement/id_user/${idUser}/id_tontine/${id}`,
          method : "GET",
          success : (res) => {
              const result = res.data ;
              this.setData({
                  result
              });
                  console.log(result);
             /* console.log(result);
              setTimeout(() =>{
                  console.log(this.data.montant) 
              }, 100);
              */
          },
          fail : (err) =>{
              console.error("Erreur de paiement " , err);
              wx.showToast({
                title: 'Erreur de paiement',
                icon : "error"
              });
          }
        })
      },
      onPhoneNumberInput: function(e) {
        this.setData({
            numeroTelephone:e.detail.value
        })
    },

      sendOtp(){
        const {numeroTelephone, name} = this.data;
        if (!numeroTelephone) {
            //this.showMessage("Veuillez sélectionner ou saisir au moins un contact", 'error');
            console.log("Veuillez sélectionner ou saisir au moins un contact", 'error')
            return;
        }
        //this.showMessage('Envoi des invitations...', 'info');
        console.log('Envoi des invitations...', 'info')

        const recipients = [{numeroTelephone: numeroTelephone, name: name || 'Invité'}]
        wx.request({
            url: `http://192.168.252.43:3000/send-otp`,
            method: 'POST',
            header: {
                'Content-Type':'application/json'
            },
            data: {
                recipients: recipients
            },
            succes: (res) => {
                if (res.statusCode === 200) {
                    const firstResult = res.data.results[0];
                    let msg = 'Invitations envoyées !';
                    if (firstResult && firstResult.status === 'success') {
                        msg =+ `Lien d'invitation: ${firstResult.invitationlink}`;
                    };
                    wx.navigateTo({
                        url: '/pages/PageGestion/PageGestion'
                      });
                    //this.showMessage(msg, 'success');
                    console.log(msg, 'success')
                } else {
                    //this.showMessage(`Erreur: ${res.data.message || "Problème lors de l'envoi des invitations"}`, 'error')
                    console.log(`Erreur: ${res.data.message || "Problème lors de l'envoi des invitations"}`, 'error')
                }
            },
            fail: (err) => {
                console.error('Erreur réseau sendOtp:', err);
                //this.showMessage('Échec de la connexion au serveur.', 'error');
            }
        });
    },

      paiement(){
        //const chpMnt= result.montant_a_cotise;
      const montant_a_cotise = this.data.result.montant_a_cotise;
      const id_participant = this.data.result.id_participant;

      const contact = this.data.result.contact;
      const id_tour = this.data.info.tour[0].id_tour;
      console.log(`montant a cotise: ${montant_a_cotise}, id_tour: ${id_tour}, contact: ${contact}, id_participant: ${id_participant}`);

    
      wx.request({
        url: `http://192.168.252.213:8000/api/insererCotisation`,
        method : "POST",
        header: {
            'accept':'application/json', 
            'content-type': 'application/json' 
          } ,
        data : {
            montant_cotise:montant_a_cotise,
            id_tour:id_tour,
            id_participant:id_participant,
            telephone:contact,
        }, 
        success : (res) => {
            console.log(res);
            if (res.statusCode === 201) {
              wx.showToast({
                title: 'Paiement réussi',
                icon: "success"
              });
            } else {
                wx.showToast({title:`Erreur : ${res.data.message || res.statusCode}`, icon:"none"});
            }
        },
        fail : (err) => {
            wx.showToast({
              title: 'Échec de la connexion',
              icon: "none"
            });
            console.error("Erreur:", err);
        }
      })
    },
      
      /*paiement(){
          //const chpMnt= result.montant_a_cotise;
        const {montant_a_cotise} = this.data.result;
        const montant = montant_a_cotise;
        wx.request({
          url: `http://192.168.252.213:8000/api/insererCotisation/`,
          method : "POST",
          header: {
              'accept':'application/json', 
              'content-type': 'application/json' 
            } ,
          data : {}, 
          success : (res) => {
              console.log("Montant :", montant);
              if (res.statusCode === 200) {
                wx.showToast({
                  title: 'Paiement réussi',
                  icon: "success"
                });
                wx.navigateTo({
                  url: 'google.com',
                })
              } else {
                  wx.showToast({title:`Erreur : ${res.data.message || res.statusCode}`, icon:"none"});
              }
          },
          fail : (err) => {
              wx.showToast({
                title: 'Échec de la connexion',
                icon: "none"
              });
              console.error("Erreur:", err);
          }
        })
      },*/


    goBack() {
      wx.navigateBack();
    },
    // Méthode pour naviguer vers la page d'invitation
    goToInvite(e) {
        const tontine = this.data.donnee.tontine.id_tontine;
      wx.navigateTo({   
        url: '/pages/PageContact/PageContact',
        success(res) {
            res.eventChannel.emit('sendDataToDetail', tontine)
        }
      });
    },
    goToCotisation() {
      wx.navigateTo({
        url: '/pages/Cotisation/Cotisation'
      });
    },
    goToNotification() {
        wx.navigateTo({
          url: '/pages/Notification/Notification'
        });
      },
    goToTour : function(e) {
        const tontine = this.data.donnee;
      wx.navigateTo({
        url: '/pages/info_tour/info_tour',
        success(res) {
            res.eventChannel.emit('sendDataToDetail', tontine)
        }
      });
    },
    goToInfoTontine : function(e)  {
        const tontine = this.data.donnee;
        wx.navigateTo({
          url: '/pages/info_tontine/info_tontine',
          success(res) {
              res.eventChannel.emit('sendDataToDetail', tontine)
          }
        })
      },
    /*goToInfoTontine() {
      wx.navigateTo({
        url: '/pages/info_tontine/info_tontine'
      });
    },*/
    openModal() {
        this.setData({ showModal: true });
      },
    
      closeModal() {
        this.setData({ showModal: false });
      },

      openModalConsultation() {
        this.setData({ showModalConsultation: true });
      },
    
      closeModalConsultation() {
        this.setData({ showModalConsultation: false });
      },

      openModalHistorique() {
        this.setData({ showModalHistorique: true });
      },
    
      closeModalHistorique() {
        this.setData({ showModalHistorique: false });
      },

      preventClose(){
      },

      Modif() {
        //Navigation
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
  })
  