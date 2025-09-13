Page({
  data: {fun:0,},
  onTap(){
    this.setData({fun:function() {return 1},})
  }

});
