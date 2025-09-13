Page({
    data: {
        js_data:0
    },
    onLoad(e){
        console.log("js_onload begin");
        this.setData({
            js_data:1
        })
        console.log("js_onload end");
    },
    js_event_handler:function(e){
        console.log("js_event_handler begin");
        this.setData({
            js_data:2
        })
        console.log("js_event_handler end");
    }
})
  