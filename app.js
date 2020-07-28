//app.js
App({
  globalData:{
    //baseUrl:"https://www.sotardust.cn/CMTGP/",
    baseUrl:"http://192.168.1.142:9000/CMTGP/"
  },
  onLaunch: function () {
    var that = this;
    var baseUrl = that.globalData.baseUrl;
    if(wx.getStorageSync('token')=='' || wx.getStorageSync('isLogin')=='' || wx.getStorageSync('isLogin')==0){
      that.userLogin(baseUrl);
    }else{
      wx.request({
        url: baseUrl+"supplier/checkToken",
        method: 'get',
        data: {token:wx.getStorageSync('token')},
        success(res) {
          var code = res.data.code;
          if(code==200){
            wx.switchTab({
              url: '/pages/index/index',
            })
          }else{
            that.userLogin(baseUrl);
          }
        },
        fail(res) {
          wx.showToast({
            icon:'none',
            title: '服务器异常'
          })
        }
      })
    }
  },
  userLogin: function(baseUrl) {
    wx.login({
      success: (res) => {
        var paras = {};
        paras.code = res.code;
        paras.type=2;
        wx.request({
          url: baseUrl+"supplier/getOpendId",
          method: 'get',
          data: paras,
          success(res) {
            if(res.data.code==200){
              var data = res.data.data;
              wx.setStorageSync('token', data.token);
              wx.setStorageSync('isLogin', data.isLogin);
              if(data.isLogin==1){
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }else{
              wx.showToast({
                title: "获取参数异常"
              })
            }
          },
          fail(res) {
            wx.showToast({
              icon:'none',
              title: '服务器异常'
            })
          }
        })
      },
    })

  },
   
})