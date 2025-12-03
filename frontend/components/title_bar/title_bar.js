// components/title_bar.js
Component({

    /**
     * Component properties
     */
    properties: {
        source_icon: {
            type: String,
            value: ''
        },
        label: {
            type: String,
            value: ''
        },
        donnee: {
          type: Object,
          value: ''
        }
    },
    /**
     * Component initial data
     */
    data: {
        nombreNotif:''
    },

    /**
     * Component methods
     */
    methods: {
        appelApi() {

        const data = {id_utilisateur:this.data.donnee.idUser, id_tontine:this.data.donnee.tontine.id_tontine}
            wx.request({
            
            url: `http://${app.globalData.url_diack}:8000/api/countNotification`,
            data:data,
            header: {
                'content-type': 'application/json'
            },
            success:function(res){
                console.log(res.data);
                this.setData({
                nombreNotif:res.data.count
                })
            }
            })
        },

        goBack() {
            wx.navigateBack({});
        },
        goToNotification() {
            const that = this; // sauvegarde du contexte

            wx.navigateTo({
            url: '/pages/notification/notification',
            success(res) {
                res.eventChannel.emit('sendDataToDetail', that.data.donnee)
            }
            });
        },

    }
})