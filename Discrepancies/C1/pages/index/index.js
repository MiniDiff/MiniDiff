Page({
  data: {
    ColorData:['background:red'],
  },
  onLoad() {
    this.setData({
      "ColorData[0]" : 'background:yellow',
    })
  },
})
