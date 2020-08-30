//app.js
App({
  globalData:{
    //baseUrl:"https://www.sotardust.cn/CMTGP/",
    baseUrl:"http://192.168.1.4:9000/CMTGP/",
    ww:0,
    hh:0,
  },
  onLaunch: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //可视窗口宽度
        var ww = res.windowWidth;
        //可视窗口高度
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    })
  },
   
})