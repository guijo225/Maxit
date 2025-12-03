// pages/inscription/inscription.js
Page({

    pageConnexion : function(){
            wx.redirectTo({
              url: '/pages/connexion/connexion',
            })
        },
    

    /**
     * Page initial data
     */
    data: {
      imagePath: '',
        nom : "",
        prenoms : "",
        pseudo : "",
        date : "",
        contact : "",  
        mot_de_passe: ""
    },

     // Mises à jour des champs
    onNomChange(e) {
        this.setData({ nom: e.detail.value });
    },
    onPrenomsChange(e) {
        this.setData({ prenoms: e.detail.value });
    },
    onPseudoChange(e) {
        this.setData({ pseudo: e.detail.value });
    },
    onContactChange(e) {
        this.setData({ contact: e.detail.value });
    },
    onDateChange(e) {
        this.setData({ date: e.detail.value });
    },
    onPasswordChange(e) {
        this.setData({
        mot_de_passe: e.detail.value
        });
    },

    inscription(e){
        wx.request({
          url: 'http://192.168.252.112:8000/api/inscription',
          method : "POST",
          header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            nom: this.data.nom,
            prenoms: this.data.prenoms,
            pseudo: this.data.pseudo,
            date_de_naissance: this.data.date,
            contact: this.data.contact,
            mot_de_passe: this.data.mot_de_passe
          },
          success : (res) => {
            console.log(res)
            if(res.statusCode == 201){
                wx.showToast({
                  title: 'Enregistrer avec succès',
                  icon : "none",
                  duration : 1500 ,
                });
                setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/historique/historique',
                    });
                }, 500)
            }
          },
          fail : (err) => {
            console.error("Erreur d'enregistrement" , err);
            wx.showToast({
              title: "Erreur d'enregistrement",
              icon : "error"
            });
            }
        });
    },

    chooseImage() {
        wx.chooseImage({
          count: 1, // nombre d’images à sélectionner
          sizeType: ['original', 'compressed'], // taille de l’image
          sourceType: ['album', 'camera'], // sources possibles
          success: (res) => {
            const path = res.tempFilePaths[0];
            this.setData({
              imagePath: path
            });
            console.log('Image sélectionnée :', path);
          },
          fail: (err) => {
            console.error('Erreur lors de la sélection de l’image', err);
          }
        });
      },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

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