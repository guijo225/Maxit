// index.js
const app = getApp();
Page({
    data: {

        result: [],
        currentDraggingIndex: -1,
        touchStartY: 0,
        startY: 0,
        isAdmin: false,
        donnee: {},
        participantList: [],
        showError:'',
        visible: true,
        errorMessage:''
    },

    onLoad(options) {
        if (options.data) {
            try {
                const data = JSON.parse(decodeURIComponent(options.data));
                console.log('Données reçues: ', data)
                this.getInfoTontine(data.tontine.id_tontine)
                if (data.tontine.role_utilisateur === "admin") {
                    this.setData({
                        isAdmin: true
                    })
                } else {
                    this.setData({
                        isAdmin: false
                    })
                }
                this.setData({
                    donnee: data
                });
            } catch (error) {
                console.error('Pas de données :', error);
                this.setData({
                    showError: true,
                    errorMessage: 'Erreur de transmission des données'
                });
            }
        }else{
            console.log('données non transmises')
        }
        this.onRefresh = () => {
            this.setData({ showError: false });
            this.getInfoTontine(this.data.donnee.tontine.id_tontine);
        };
    },

    getInfoTontine(id_tontine){
        wx.request({
            url: `${app.globalData.url_laravel}/api/tontine/${id_tontine}`,
            method: 'GET',
            success: (res) => {
                const result = res.data;
                this.setData({
                    result: result,
                    visible: false
                });
                this.setData({
                    participantList: result.tontine.participant
                });
                console.log('participant est :', this.data.participantList);
            },
            fail: (err) => {
                console.error('Erreur chargement :', err);
                this.setData({
                    showError: true,
                    errorMessage: 'Problème de connexion lors du chargement des informations de la tontine.',
                    visible: false
                });
            }
        });
    },

    showModal: function () {
        this.setData({
            showModal: true
        });
    },

    hideModal: function () {
        this.setData({
            showModal: false
        });
    },

    openModal() {
        //console.log(this.data.participantList)
        this.setData({
            showModal: true
        });
        setTimeout(() => {
            this.setData({
                modalVisible: true
            })
        }, 50);
    },

    closeModal() {
        this.setData({
            modalVisible: false
        });
        setTimeout(() => {
            this.setData({
                showModal: false
            })
        }, 300);
    },
    onTouchStart(e) {
        this.setData({
            startY: e.touches[0].clientY,
            currentDraggingIndex: e.currentTarget.dataset.index
        });
    },


    onTouchMove(e) {
        const moveY = e.touches[0].clientY;
        const deltaY = moveY - this.data.startY;
        const currentIndex = this.data.currentDraggingIndex;
        const participants = [...this.data.participantList];

        let targetIndex = currentIndex;

        if (deltaY > 50 && currentIndex < participants.length - 1) {
            targetIndex = currentIndex + 1;
        }

        if (deltaY < -50 && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        }

        if (targetIndex !== currentIndex) {
            const temp = participants[currentIndex];
            participants[currentIndex] = participants[targetIndex];
            participants[targetIndex] = temp;

            this.setData({
                participantList: participants,
                currentDraggingIndex: targetIndex,
                startY: moveY
            });
        }
    },

    onTouchEnd() {
        this.setData({
            currentDraggingIndex: -1
        });

        const newOrdre = this.data.participantList.map((item, index) => ({
            id: item.id_participant,
            ordre: index + 1
        }));


        wx.request({
            url: `${app.globalData.url_laravel}/api/update-ordre`,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: newOrdre,
            success: res => {
                wx.showToast({
                    title: 'Ordre mis à jour',
                    icon: 'success'
                });
            },
            fail: () => {
                wx.showToast({
                    title: 'Erreur',
                    icon: 'error'
                });
            }
        });
    },
})