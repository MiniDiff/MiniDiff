Page({
  data: {
    ColorData:['background:red'],
  },
  onLoad() {
    this.setData({
      [`ColorData[${this.data.selected.length}]`]: 'background:yellow',
    })
  },
})
