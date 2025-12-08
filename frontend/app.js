// app.js
App({
    globalData: {
        maxitId: 2,
        url_laravel:"https://api-laravel-qt66.onrender.com",
        url_node:" https://serveurs-node.onrender.com",
        url_fastapi:"https://api-paiement.onrender.com",

        utilisateur: {}
    },

    onLaunch() {
            this.login(this.globalData.maxitId)
    },

    login(id) {
        try {
            wx.request({
                url: `${this.globalData.url_laravel}/api/login/${id}`,
                method: "GET",
                success: (res) => {
                    if (res.data.success && res.data.utilisateur) {
                        const utilisateur = res.data.utilisateur;
                        this.globalData.utilisateur = utilisateur

                        console.log("Utilisateur ID:", utilisateur.id_utilisateur);
                    } else {
                        wx.redirectTo({
                            url: '/pages/condition_generale/condition_generale',
                        });
                    }
                }
            });
        } catch (error) {
            console.error("Erreur requête API (login) :", error);
            this.setData({
                showError: true,
                errorMessage: 'Problème lors de la tentative de connexion.'
            })
        }
    },
})