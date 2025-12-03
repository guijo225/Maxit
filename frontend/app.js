// app.js
App({
    globalData: {
        maxitId: 2,
        //url_backend: "192.168.252.186",
        //url_guitto_laravel: "192.168.252.54:8001",
        //url_guitto_fastapi: "192.168.252.54:8000",
       // url_guitto: "192.168.252.54",
       // url_guitto2: "192.168.252.54",
        url_backend: "192.168.252.13",

        utilisateur: {}
    },

    onLaunch() {
            this.login(this.globalData.maxitId)
    },

    login(id) {
        try {
            wx.request({
                url: `http://${this.globalData.url_backend}:8001/api/login/${id}`,
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