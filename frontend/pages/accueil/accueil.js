const app = getApp();
Page({
    /**
     * Page initial data
     */
    data: {
        menuOpen: false,
        showFail: false,
        tontines: [], // Toutes les tontines brutes
        filteredTontines: [], // Tontines après application du filtre
        users: {},
        visible: true,
        showError: '',
        errorMessage: '',
        loaded: false,
        id: 4,
        currentFilter: 'all', // Filtre actif par défaut
        emptyMessage: 'Créez des tontines sécurisées pour vous et vos proches', // Message par défaut
        filters: [{
            label: 'Toutes',
            value: 'all',
            emptyMessage: 'Créez des tontines sécurisées pour vous et vos proches'
        },
        {
            label: 'En cours',
            value: 'En cours',
            emptyMessage: 'Aucune tontine en cours'
        },
        {
            label: 'En attente',
            value: 'En attente',
            emptyMessage: 'Aucune tontine en attente'
        },
        {
            label: 'Terminer',
            value: 'Terminer',
            emptyMessage: 'Aucune tontine terminée'
        },
        {
            label: 'Suspendue',
            value: 'suspendue',
            emptyMessage: 'Aucune tontine suspendue'
        }
        ]
    },

    toggleMenu() {
        this.setData({
            menuOpen: !this.data.menuOpen
        });
    },

    createAction() {
        console.log("Créer action cliquée");
        // ici tu mets ta logique de création
    },
    integrateAction() {
        console.log("Intégrer action cliquée");
        // ici ta logique d'intégration
    },
    /**
     * Format date to DD/MM/YYYY
     */
    formatDate: function (dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /*
     * Gérer le changement de filtre
     */
    filterTontines: function (e) {
        const filter = e.currentTarget.dataset.filter;
        const filterObj = this.data.filters.find(f => f.value === filter);
        const emptyMessage = filterObj ? filterObj.emptyMessage : 'Aucune tontine disponible';

        this.setData({
            currentFilter: filter,
            emptyMessage: emptyMessage
        });

        // Appliquer le filtre
        let filteredTontines = this.data.tontines;
        if (filter !== 'all') {
            filteredTontines = this.data.tontines.filter(tontine => tontine.statut_tontine === filter);
        }

        this.setData({
            filteredTontines: filteredTontines
        });
    },

    CreeTontine: function () {
        wx.navigateTo({
            url: '/pages/creation_tontine/creation_tontine',
        });
    },

    IntegreTontine: function () {
        const idUser = this.data.users.id_utilisateur;
        wx.navigateTo({
            url: '/pages/integration_utilisateur/integration_utilisateur',
            /*success(res) {
                res.eventChannel.emit('sendDataToDetail', idUser);
            }*/
        });
    },

    NavPageGestion: function (e) {
        const tontine = e.currentTarget.dataset.tontine;
        const idUser = this.data.users.id_utilisateur;
        const data = {
            idUser,
            tontine
        };
        const encodedData = encodeURIComponent(JSON.stringify(data));
        wx.navigateTo({
            url: `/pages/PageGestion/PageGestion?data=${encodedData}`,
            // success(res) {
            //     res.eventChannel.emit('sendDataToDetail', data);
            // }
        });
    },

    /**
     * Lifecycle function--Called when page load
     */ // pages/accueil/accueil.js

    /**
   * Lifecycle function--Called when page load
   */ // pages/accueil/accueil.js
    checkUserAndLoadTontine() {
        const App = getApp();
        const waitForUser = setInterval(() => {
            const user = App.globalData.utilisateur;
            if (user && user.id_utilisateur) {
                clearInterval(waitForUser);
                console.log('Utilisateur disponible:', user);
                this.getTontine(user.id_utilisateur);
            }
        }, 300);
    },

    onLoad() {
        this.checkUserAndLoadTontine();
    },

    onShow() {
        this.checkUserAndLoadTontine();
    },


    /*login(id) {
        try {
            wx.request({
                url: `http://${app.globalData.url_diack}:8000/api/login/${id}`,
                method: "GET",
                success: (res) => {
                    if (res.data.success && res.data.utilisateur) {
                        const utilisateur = res.data.utilisateur;
                        this.setData({
                            users: utilisateur
                        });
                        console.log("Utilisateur ID:", utilisateur.id_utilisateur);
                        this.getTontine(utilisateur.id_utilisateur)
                    } else {
                        wx.redirectTo({
                            url: '/pages/condition_generale/condition_generale',
                        });
                    }
                }
            });
        } catch (error) {
            console.error("Erreur requête API (login) :", err);
            this.setData({
                showError: true,
                errorMessage: 'Problème lors de la tentative de connexion.'
            })
        }
    },*/

    getTontine(id_utilisateur) {
        wx.request({
            url: `http://${app.globalData.url_backend}:3000/first/afficher/${id_utilisateur}`,
            method: "GET",
            success: (res2) => {
                console.log("Tontines reçues:", res2.data);

                // Formatter les dates pour toutes les tontines
                const formattedTontines = Array.isArray(res2.data) ? res2.data.map(tontine => ({
                    ...tontine,
                    date_creation: this.formatDate(tontine.date_creation)
                })) : [];

                this.setData({
                    tontines: formattedTontines,
                    filteredTontines: formattedTontines, // Afficher toutes les tontines par défaut
                    emptyMessage: this.data.filters[0].emptyMessage, // Message par défaut pour "Tout"
                    loaded: true,
                    visible: false
                });
            },
            fail: (err) => {
                console.error("Erreur requête API (afficher) :", err);
                this.setData({
                    showError: true,
                    errorMessage: 'Problème de connexion lors du chargement des tontines.'
                });
            }
        });
    },
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() { },

    /**
     * Lifecycle function--Called when page show
     */

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() { },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() { },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() { },

    /**
     * Called when page reach bottom
     */
    onReachBottom() { },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() { }
});