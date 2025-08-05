Page({

  /**
   * Page initial data
   */
  data: {
   searchQuery: '',
   isFocused: false,
    selectedId: null,
    donne: [
      { id: "1", price: "19700 FCFA", value: "10% de reduction" },
      { id: "2", price: "18700 FCFA", value: "15% de reduction" },
      { id: "3", price: "Autre", value: "proposez un prix" }
    ]
  },

  selectCard(e) {
    this.setData({
      selectedId: e.currentTarget.dataset.id
    });
  },
  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    });
  },
  onFocus(){
    this.setData({
      isFocused: true
    })
  },
  onBlur(){
    this.setData({
      isFocused: false
    })
  },
  choisir(){

  }
  
})