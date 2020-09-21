//app.js
App({
  globalData:{
    baseUrl:"https://www.sotardust.cn/CMTGP/",
    //baseUrl:"http://192.168.1.142:9000/CMTGP/",
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
  onShow:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    if(token!=''){
      wx.request({
        url: that.globalData.baseUrl+"mini/checkToken",
        method: 'get',
        data: {token:wx.getStorageSync('token')},
        success(res) {
          if(res.data.code!=200){
            wx.login({
              success: (res) => {
                var paras = {};
                paras.code = res.code;
                paras.type=2;
                wx.request({
                  url: that.globalData.baseUrl+"supplier/getOpendId",
                  method: 'get',
                  data: paras,
                  success(res) {
                    if(res.data.code==200){
                      wx.setStorageSync('token', res.data.data.token);
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  }
   
})