const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        tour: [],
        type_tontine: [],
        participantsList: [],
        participant: [],
        penaliteList: [],
        tours: [],
        resultat: [],
        showError: '',
        errorMessage:'',
        visible: true,
        formData: {
            tour: ''
        }
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        if (options.data) {
            const data = JSON.parse(decodeURIComponent(options.data))
            console.log('Données reçues: ', data)
            this.setData({
                tontine: data
            });
            //tontine = data;
            this.getTour(data.tontine.id_tontine)
        } else {
            console.log("Les données n'ont pas été envoyé")
        }
        this.onRefresh = () => {
            this.setData({
                showError: false
            });
            this.chargeTour(this.data.donnee.tontine.id_tontine);
        };
    },

    getTour(id_tontine) {
        wx.request({
            url: `${app.globalData.url_laravel}/api/tontine/${id_tontine}`,
            method: 'GET',
            success: (res) => {
                const result = res.data;
                console.log(result);
                this.setData({
                    result,
                    resultat: res.data,
                    visible: false,
                });
                console.log(this.data.resultat.tontine.tour[0].numero_tour)
                console.log(this.data.resultat.tontine.tour[0].id_tour)
                const numero0 = this.data.resultat.tontine.tour[0].numero_tour
                const numero1 = this.data.resultat.tontine.tour[0].id_tour
                this.prepareParticipantData(numero1)
                this.penaliteParticipant(numero1);
                this.recuperationData(numero0);
                const numOrdres = [];
                for (let i = 0; i < this.data.resultat.tontine.tour.length; i++) {
                    if (this.data.resultat.tontine.tour[i].statut_tour === "terminé") {
                        numOrdres.push(this.data.resultat.tontine.tour[i].numero_tour)
                    }
                }
                this.setData({
                    type_tontine: numOrdres
                })
                console.log(this.data.type_tontine)
            },
            fail: (err) => {
                console.error('Erreur chargement membres :', err);
                this.setData({
                    showError: true, // Affiche le composant
                    errorMessage: 'Erreur de connexion au serveur. Veuillez réessayer.',
                    visible: false,
                });
            }
        });
    },
    openTypeTontineOptions() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.type_tontine.map(item => `Tour N°${item.toString()}`),
            success(res) {
                const selected = that.data.type_tontine[res.tapIndex];
                that.setData({
                    'formData.tour': selected
                });
                that.tourInfo(selected)
            },
            fail(err) {
                console.log('Annulé ou erreur', err);
            }
        });
    },

    tourInfo(numTour) {
        console.log(numTour)
        console.log(this.data.resultat)
        for (let i = 0; i < this.data.resultat.tontine.tour.length; i++) {
            const t = this.data.resultat.tontine.tour[i];
            if (t.statut_tour === "terminé" && t.numero_tour == numTour) {
                console.log(t)
                this.setData({
                    tour: t
                })
                const id = t.id_tour;
                console.log(id)
                this.prepareParticipantData(id);
                this.penaliteParticipant(id);
                return t
            }
        }
        console.log('Aucun tour trouvé pour ce numéro de tour:', numTour)
    },

    prepareParticipantData(tourId) {
        const participants = [];
        if (this.data.resultat && this.data.resultat.tontine) {
            this.data.resultat.tontine.participant.forEach(participant => {
                participant.cotisation.forEach(cotisation => {
                    if (cotisation.id_tour === tourId) {
                        participants.push({
                            nom: participant.utilisateur.nom,
                            prenoms: participant.utilisateur.prenoms,
                            montant: cotisation.montant_cotise,
                            date: cotisation.date_cotisation
                        });
                    }
                });
            });
        }
        participants.sort((a, b) => new Date(a.date) - new Date(b.date))
        this.setData({
            participantsList: participants
        });
    },

    penaliteParticipant(tourId) {
        const penalites = [];
        if (this.data.resultat && this.data.resultat.tontine) {
            this.data.resultat.tontine.participant.forEach(participant => {
                participant.penalite.forEach(penalite => {
                    if (penalite.id_tour === tourId) {
                        penalites.push({
                            nom: participant.utilisateur.nom,
                            prenoms: participant.utilisateur.prenoms,
                            montant: penalite.montant_penalite,
                            date: penalite.date_penalite,
                            statut: penalite.statut_penalite,
                        });
                    }
                });
            });
        }
        penalites.sort((a, b) => new Date(a.date) - new Date(b.date))
        this.setData({
            penaliteList: penalites
        });
    },

    recuperationData(numTour) {
        const participants = [];
        if (this.data.resultat && this.data.resultat.tontine) {
            this.data.resultat.tontine.participant.forEach(participant => {
                if (participant.numero_ordre === numTour) {
                    participants.push({
                        nom: participant.utilisateur.nom,
                        prenoms: participant.utilisateur.prenoms
                    });
                }
            });
        }
        participants.sort((a, b) => new Date(a.date) - new Date(b.date))
        this.setData({
            participant: participants
        });
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

    }
})