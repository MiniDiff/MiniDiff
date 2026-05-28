Page({
  data: {
    JSList:[
      //放在数组中的数据
    ],
    //js全局数据

    getSum : function(total, num) {return total + num;},
  },
  js_BoC : function(event){
    console.log("js_BoC : begin Num:" +event.currentTarget.dataset.pdata)
    this.setData({
    })
    console.log("js_BoC : end")
  },
  onLoad:function(options){
    console.log("onLoad : begin ")
    this.setData({
    })
    console.log("onLoad : end")
  },
  onShow:function(){
    console.log("onShow : begin ")
    this.setData({
    })
    console.log("onShow : end")
  },
})