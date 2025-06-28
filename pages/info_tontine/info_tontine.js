// index.js
Page({
  data: {
  },

  showModal: function() {
    this.setData({
      showModal: true
    });
  },

  hideModal: function() {
    this.setData({
      showModal: false
    });
  },

  openModal(){
    this.setData({ showModal : true});
    setTimeout(()=>{
      this.setData({modalVisible : true})
    },50);
  },

  closeModal(){
    this.setData({ modalVisible : false});
    setTimeout(()=>{
      this.setData({showModal : false})
    },300);
  },

  onLoad(){
    this.chargePage();
  },

  chargePage() {
    wx.request({
      url:'http://192.168.252.43:8000/api/tontine/3',
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
      url: 'http://192.168.252.43:8000/api/tontine/3',
    })
  },
  onTouchStart(e) {
  console.log(chargePage.participant.numero_ordre);
  const index = e.currentTarget.dataset.chargePage;
  this.setData({
      dragIndex: index,
      touchStartY: e.touches[0].clientY
  });
},

onTouchMove(e) {
  const { dragIndex, result, touchStartY } = this.data;
  if (dragIndex === -1) return;

  const currentY = e.touches[0].clientY;
  const deltaY = currentY - touchStartY;
  const itemHeight = 60; // Hauteur approximative d'un élément
  const moveIndex = Math.round(deltaY / itemHeight);

  if (moveIndex !== 0) {
      const newIndex = Math.max(0, Math.min(result.length - 1, dragIndex + moveIndex));
      if (newIndex !== dragIndex) {
          const newList = [...result];
          const [movedItem] = newList.splice(dragIndex, 1);
          newList.splice(newIndex, 0, movedItem);
          this.setData({
              result: newList,
              dragIndex: newIndex,
              touchStartY: currentY
          });
      }
  }
},

onTouchEnd() {
  this.setData({
      dragIndex: -1
  });
},
})


