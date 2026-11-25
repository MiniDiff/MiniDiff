const app = getApp()

Page({
  data: {
    List:[]
  },
  onLoad: function () {
    this.setData({
      List:[
        {
          title:'first',
          childList:[{title:'second'}]
        }]
    })
  },
})
