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
    },
    /*onLoad(options){
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('sendDataToDetail', (data) => {
            console.log(data);
            this.setData({tontine:data});
            this.chargePage();
        });
        if (options.tontineId) {
            this.setData({'tontine.id_tontine': options.tontineId});
            this.chargePage();
        }
    },*/

    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('sendDataToDetail', (data) => {
            console.log(data);
            if (data.tontine.role_utilisateur === "admin") {
                this.setData({
                    isAdmin: true
                })
                //isAdmin = true
            } else {
                this.setData({
                    isAdmin: false
                })
            }
            this.setData({
                donnee: data
            });
            //tontine = data; 
            wx.request({
                url: `http://192.168.252.43:8000/api/tontine/${data.tontine.id_tontine}`,
                method: 'GET',
                success: (res) => {
                    const result = res.data;
                    this.setData({
                        result: result
                    });
                    this.setData({
                        participantList: result.tontine.participant
                    });
                    console.log('participant est :', this.data.participantList);
                },
                fail: (err) => {
                    console.error('Erreur chargement membres :', err);
                }
            });
        });
        //this.chargePage();
        eventChannel.on('sendDataToDetail', (data) => {
            console.log('Reçu :', data);
            this.setData({
                result: data.list || []
            });
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
    /*chargePage() {
        //const id = this.data.tontine.id_tontine
      wx.request({
        url:`http://192.168.252.43:8000/api/tontine/14`,
        method: 'GET',
        success: (res) => {
          const result = res.data;
            console.log(result);
          this.setData({
            result
          });
        },
        fail:(err) => {
          console.error('Erreur chargement membres :', err);
        }
      });
    },
    chargeParticipant(){
      wx.request({
        url: 'http://192.168.252.43:8000/api/tontine/14',
      })
    },*/
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
        url: 'http://192.168.252.213:8000/api/update-ordre',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: newOrdre,
        success: res => {
          wx.showToast({ title: 'Ordre mis à jour', icon: 'success' });
        },
        fail: () => {
          wx.showToast({ title: 'Erreur', icon: 'error' });
        }
      });
    },
})