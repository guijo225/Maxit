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
        }
    },
    goBack() {
        wx.navigateBack({});
      },
      goToNotification() {
        wx.navigateTo({
          url: '/pages/Notification/Notification'
        });
      },
    /**
     * Component initial data
     */
    data: {

    },

    /**
     * Component methods
     */
    methods: {

    }
})