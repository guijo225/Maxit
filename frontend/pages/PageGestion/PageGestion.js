const app = getApp();
Page({
    data: {
        showModalPaie: false,
        modalVisiblePaie: false,
        showModalConsultation: false,
        modalVisibleConsultation: false,
        donnee: {},
        numeroTelephone: '+225',
        isAdmin: false,
        recipients: [],
        loaded: false,
        aPayer: false,
        statut_tontine: false,
        visible: true,
        info: [],
        showError: '',
        formData: {
            id_tontine: '',
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
        frequenceOptions: ['Hebdomadaire', 'Quinzaine', 'Mensuelle', 'Deux mois', 'Trimestrielle', 'Autres'],
        // Liste des rappels possibles
        rappelOptions: ['1 jours avant', '2 jours avant', '3 jours avant', '4 jours avant', '5 jours avant', '20 minutes'],
        // Liste des types de tontine possibles
        type_tontine: ['Tontine avec assurance', 'Tontine sans assurance', 'Tontine différée'],
        isDisabled: false
    },

    onLoad(options) {
        const idUser = app.globalData.utilisateur.id_utilisateur
        if (options.data) {
            try {
                const receivedData = JSON.parse(decodeURIComponent(options.data));
                console.log('Données reçues:', receivedData);
                if (receivedData.tontine.statut_tontine == 'terminé') {
                    this.setData({
                        statut_tontine: true
                    })
                }
                this.setData({
                    donnee: receivedData
                });
                if (receivedData.tontine.role_utilisateur === "admin" || receivedData.tontine.id_utilisateur === idUser) {
                    this.setData({
                        isAdmin: true
                    })
                } else {
                    this.setData({
                        isAdmin: false
                    })
                }
                this.chargeTour(receivedData.tontine.id_tontine);
            } catch (error) {
                console.error('Erreur parsing data:', error);
            }
        }
        this.onRefresh = () => {
            this.setData({ showError: false });
            this.chargeTour(this.data.donnee.tontine.id_tontine);
        };

        this.refreshInterval = setInterval(() => {
            this.chargeTour(this.data.donnee.tontine.id_tontine);
        }, 10000); //10 secondes
    },
    
    onUnload() {
        // Nettoyage pour éviter les fuites de mémoire
        clearInterval(this.refreshInterval);
    },

    lancerPaiement() {
        if (this.data.loaded && this.data.info.tour.length === 0) {
            wx.showToast({
                title: 'La tontine n\'a pas encore débuté',
                icon: 'none',
                duration: 5000
            });
            return;
        }
        this.openModalPaie();
        this.info_paiement();
    },

    openModalPaie() {
        this.setData({
            showModalPaie: true
        });
        setTimeout(() => {
            this.setData({
                modalVisiblePaie: true
            });
        }, 50);
    },

    closeModalPaie() {
        this.setData({
            modalVisiblePaie: false
        });
        setTimeout(() => {
            this.setData({
                showModalPaie: false
            });
        }, 300);
    },

    chargeTour(id_tontine) {
        wx.request({
            url: `${app.globalData.url_laravel}/api/tour/${id_tontine}`,
            method: "GET",
            success: (res) => {
                const info = res.data;
                // console.log(info)
                this.setData({
                    info: res.data,
                    loaded: true,
                })

                // On attend un peu avant de cacher le loader (on le voit bien)
                setTimeout(() => {
                    this.setData({
                        visible: false
                    });
                }, 800);


                if (info.tour.length !== 0) {
                    this.setData({
                        isDisabled: true,
                        visible: false
                    })
                }
                // console.log('les tours sont', info, 'et', this.data.isDisabled);
            },
            fail: (err) => {
                console.error("Erreur de paiement ", err);
                this.setData({
                    showError: true, // Affiche le composant
                    visible: false,
                    errorMessage: 'Erreur de connexion au serveur. Veuillez réessayer.'
                });
            }
        })
    },

    info_paiement() {
        const idUser = app.globalData.utilisateur.id_utilisateur
        const id = this.data.donnee.tontine.id_tontine;
        const idTour = this.data.info.tour[0].id_tour;
        console.log(id)
        console.log(idUser)
        console.log(idTour)
        wx.request({
            
            url: `${app.globalData.url_fastapi}/infos_paiement/id_user/${idUser}/id_tontine/${id}/id_tour/${idTour}`,
            method: "GET",
            success: (res) => {
                const result = res.data;
                this.setData({
                    result
                });
                console.log(result);
                console.log(this.data.info.tour[0].cotisation.length);
                for (let i = 0; i < this.data.info.tour[0].cotisation.length; i++) {
                    if (this.data.info.tour[0].cotisation[i].id_participant == result.id_participant) {
                        this.setData({
                            aPayer: true
                        })
                    }
                }
            },
            fail: (err) => {
                console.error("Erreur de paiement ", err);
                this.setData({
                    showError: true,
                    errorMessage: 'Problème de connexion lors du chargement des informations de paiement.'
                });
            }
        })
    },

    onPhoneNumberInput(e) {
        let value = e.detail.value;
        // Empêcher la suppression du préfixe +225
        if (!value.startsWith('+225')) {
            value = '+225';
        }
        // Limiter la saisie à +225 suivi de 10 chiffres maximum
        const numberPart = value.replace('+225', '');
        if (numberPart.length > 10 || !/^\d*$/.test(numberPart)) {
            value = '+225' + numberPart.slice(0, 10);
        }
        // Vérifier si le numéro est valide (exactement 10 chiffres après +225)
        const isValid = value.replace('+225', '').length === 10;
        this.setData({
            numeroTelephone: value,
            isValidNumber: isValid
        });
    },

    sendOtp() {
        const { numeroTelephone, name } = this.data;
        if (!numeroTelephone) {
            wx.showToast({
                title: 'Veuillez saisir un numéro',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        const id = this.data.donnee.tontine.id_tontine;
        const nomTontine = this.data.donnee.tontine.nom_tontine;
        const recipients = [{ numeroTelephone: numeroTelephone, name: name || 'Invité' }];
        // console.log(id);
        // console.log(recipients);
        console.log('Envoi des invitations...', 'info:', id, recipients, nomTontine);
        wx.request({
            url: `${app.globalData.url_node}/send-otp`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                recipients: recipients,
                id_tontine: id,
                nom_tontine: nomTontine
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    setTimeout(() => {
                        this.closeModal();
                    }, 2000);
                    wx.showToast({
                        title: 'Code envoyé',
                        icon: 'success',
                        duration: 2000
                    });
                    this.setData({
                        numeroTelephone: ''
                    })
                } else if (res.statusCode === 409) {
                    setTimeout(() => {
                        this.closeModal();
                    }, 5000);
                    wx.showToast({
                        title: 'Ce contact est déjà membre de la tontine',
                        icon: 'none',
                        duration: 5000
                    });
                    this.setData({
                        numeroTelephone: ''
                    })
                } else {
                    setTimeout(() => {
                        this.closeModal();
                    }, 5000);
                    wx.showToast({
                        title: 'Échec de l\'envoi',
                        icon: 'none',
                        duration: 5000
                    });
                    this.setData({
                        numeroTelephone: ''
                    })
                }
            },
            fail: (err) => {
                wx.showToast({
                    title: 'Échec de l\'envoi',
                    icon: 'none',
                    duration: 5000
                });
                setTimeout(() => {
                    this.closeModal();
                }, 2000);
                console.error('Erreur réseau sendOtp:', err);
            }
        });
    },

    paiement() {
        const montant_a_cotise = this.data.result.montant_a_cotise;
        const id_participant = this.data.result.id_participant;
        const contact = this.data.result.contact;
        const id_tour = this.data.info.tour[0].id_tour;
        // console.log(`montant a cotise: ${montant_a_cotise}, id_tour: ${id_tour}, contact: ${contact}, id_participant: ${id_participant}`);
        wx.request({
            url: `${app.globalData.url_laravel}/api/insererCotisation`,
            method: "POST",
            header: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            data: {
                montant_cotise: montant_a_cotise,
                id_tour: id_tour,
                id_participant: id_participant,
                telephone: contact,
                mode_paiement: 'mobile money'
            },
            success: (res) => {
                console.log(res);
                if (res.statusCode === 201) {
                    wx.showToast({
                        title: 'Paiement réussi',
                        icon: "success",
                        duration: 5000
                    });
                    this.chargeTour(this.data.donnee.tontine.id_tontine);
                    this.closeModalPaie()
                } else {
                    wx.showToast({
                        title: `Erreur : ${res.data.message || res.statusCode}`,
                        icon: "none",
                        duration: 5000
                    });
                    console.error("Erreur:", res);
                }
            },
            fail: (err) => {
                wx.showToast({
                    title: 'Échec de la connexion',
                    icon: "none",
                    duration: 5000
                });
                console.error("Erreur:", err);
            }
        })
    },

    goBack() {
        wx.navigateTo({
            url: '/pages/accueil/accueil'
        });
    },

    goToInvite(e) {
        const tontine = this.data.donnee.tontine.id_tontine;
        const encodedData = encodeURIComponent(JSON.stringify(data))
        wx.navigateTo({
            url: `/pages/PageContact/PageContact?data=${encodedData}`,
            // success(res) {
            //     res.eventChannel.emit('sendDataToDetail', tontine)
            // }
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

    goToTour: function (e) {
        if (this.data.loaded && this.data.info.tour.length === 0) {
            wx.showToast({
                title: 'La tontine n\'a pas encore débuté',
                icon: 'none',
                duration: 5000
            });
            return;
        }
        const tontine = this.data.donnee;
        const encodedData = encodeURIComponent(JSON.stringify(tontine))
        wx.navigateTo({
            url: `/pages/info_tour/info_tour?data=${encodedData}`
        });
    },

    goToInfoTontine: function (e) {
        if (this.data.loaded && this.data.info.tour.length === 0) {
            wx.showToast({
                title: 'La tontine n\'a pas encore débuté',
                icon: 'none',
                duration: 5000
            });
            return;
        }
        const tontine = this.data.donnee;
        const encodedData = encodeURIComponent(JSON.stringify(tontine))
        wx.navigateTo({
            url: `/pages/info_tontine/info_tontine?data=${encodedData}`,
            // success(res) {
            //     res.eventChannel.emit('sendDataToDetail', tontine)
            // }
        });
    },

    goToHistorique: function (e) {
        if (this.data.loaded && this.data.info.tour.length === 0) {
            wx.showToast({
                title: 'La tontine n\'a pas encore débuté',
                icon: 'none',
                duration: 5000
            });
            return;
        }
        const tour = this.data.donnee;
        const encodedData = encodeURIComponent(JSON.stringify(tour))
        wx.navigateTo({
            url: `/pages/historique/historique?data=${encodedData}`,
        })
    },

    openModal() {
        this.setData({
            showModal: true
        });
    },

    closeModal() {
        this.setData({
            showModal: false
        });
    },

    openModalConsultation() {
        this.setData({
            showModalConsultation: true
        });
        setTimeout(() => {
            this.setData({
                modalVisibleConsultation: true
            });
        }, 50);
    },

    closeModalConsultation() {
        this.setData({
            modalVisibleConsultation: false
        });
        setTimeout(() => {
            this.setData({
                showModalConsultation: false
            });
        }, 300);
    },

    openModalHistorique() {
        this.setData({
            showModalHistorique: true
        });
    },

    closeModalHistorique() {
        this.setData({
            showModalHistorique: false
        });
    },

    Modif() {
        wx.redirectTo({
            url: '/pages/index/index',
        })
    },

    openModalModifRegle() {
        this.closeModalConsultation()
        this.setData({
            showModalModifRegle: true,
            ['formData.id_tontine']: this.data.donnee.tontine.id_tontine,
            ['formData.nom']: this.data.donnee.tontine.nom_tontine,
            ['formData.description']: this.data.donnee.tontine.description_tontine,
            ['formData.type_tontine']: this.data.donnee.tontine.type_tontine,
            ['formData.regles']: this.data.donnee.tontine.regles,
            ['formData.montant']: this.data.donnee.tontine.montant_a_cotise,
            ['formData.frequence']: this.data.donnee.tontine.frequence,
            ['formData.participants']: this.data.donnee.tontine.nombre_participants,
            ['formData.date_echeance']: this.data.donnee.tontine.date_echeance,
        });
        setTimeout(() => {
            this.setData({
                modalVisibleRegle: true
            });
        }, 50);
    },

    closeModifRegle() {
        console.log("ferme la modal")
        this.setData({
            modalVisibleRegle: false
        });
        setTimeout(() => {
            this.setData({
                showModalModifRegle: false
            });
        }, 300);
    },

    openFrequenceOptions() {
        if (this.data.isDisabled) {
            return;
        }
        const that = this;
        wx.showActionSheet({
            itemList: this.data.frequenceOptions,
            success(res) {
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

    openTypeTontineOptions() {
        if (this.data.isDisabled) {
            return;
        }
        const that = this;
        wx.showActionSheet({
            itemList: this.data.type_tontine,
            success(res) {
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

    openRappelOptions() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.rappelOptions,
            success(res) {
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

    onInputChange(e) {
        const field = e.currentTarget.dataset.field;
        const value = e.detail.value;
        this.setData({
            [`formData.${field}`]: value
        });
    },

    confirmModal() {
        const { formData } = this.data;
        if (!formData.id_tontine || !formData.nom || !formData.type_tontine || !formData.montant || !formData.frequence || !formData.participants || !formData.date_echeance) {
            wx.showToast({
                title: 'Champs requis manquants',
                icon: 'none'
            });
            return;
        }

        const formDataWithId = { ...formData };
        console.log('Données envoyées :', formDataWithId);

        wx.showLoading({
            title: 'Modification...',
            mask: true
        });

        wx.request({
            url: `${app.globalData.url_node}/first/update`,
            method: 'POST',
            data: formDataWithId,
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: 'Succes',
                        icon: 'success'
                    });
                    console.log(res);
                    setTimeout(() => {
                        const data = res.data;
                        console.log(data)
                    }, 500);
                    this.setData({
                        modalVisibleRegle: false,
                        ['donnee.tontine.nom_tontine']: formData.nom,
                        ['donnee.tontine.description_tontine']: formDataWithId.description,
                        ['donnee.tontine.type_tontine']: formDataWithId.type_tontine,
                        ['donnee.tontine.regles']: formDataWithId.regles,
                        ['donnee.tontine.montant_a_cotise']: formDataWithId.montant,
                        ['donnee.tontine.frequence']: formDataWithId.frequence,
                        ['donnee.tontine.nombre_participants']: formDataWithId.participants,
                        ['donnee.tontine.date_echeance']: formDataWithId.date_echeance
                    })
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
})