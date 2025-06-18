// pages/tour/tour.js
Page({

    /**
     * Page initial data
     */
    data: {
        showModal : false ,
        modalVisible: false,
        montant : 1,
        contact : "" ,
    },

    lancerPaiement(){
        this.openModal();
        this.info_paiement();
    },
     

    openModal() {
        this.setData({ showModal: true });
        setTimeout(() => {
          this.setData({ modalVisible: true });
        }, 50);
      },
    
      closeModal() {
        this.setData({ modalVisible: false });
        setTimeout(() => {
          this.setData({ showModal: false });
        }, 300); 
      },

      //Fonction pour recup et afficher les valeurs de la bd (montant,contact)
      info_paiement(){
        wx.request({
          url: 'http://192.168.252.196:8000/infos_paiement/id_user:1/id_tontine:1',
          method : "GET",
          success : (res) => {
              const result = res.data ;
              this.setData({
                  montant : result[0], 
                  contact : result[1],
              });
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

      
      paiement(){
        const montant = this.data.montant ;
        wx.request({
          url: 'http://192.168.252.196:8000/cotisation-tontine/${montant}',
          method : "POST",
          header: { 'content-type': 'application/json' } ,
          data : {montant}, 
          success : (res) => {
              console.log("Montant :", montant);
              if (res.statusCode === 200) {
                wx.showToast({
                  title: 'Paiement réussi',
                  icon: "success"
                });
              }
          },
        })
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