//app.js
App({
  globalData:{
    //baseUrl:"https://www.sotardust.cn/CMTGP/",
    baseUrl:"http://192.168.1.4:9000/CMTGP/"
  },
  onLaunch: function () {
    // var baseUrl = this.globalData.baseUrl;
    // wx.login({
    //   success: (res) => {
    //     var paras = {};
    //     paras.code = res.code;
    //     paras.type=2;
    //     wx.request({
    //       url: baseUrl+"supplier/getOpendId",
    //       method: 'get',
    //       data: paras,
    //       success(res) {
    //         if(res.data.code==200){
    //           var result = res.data.data;
    //           wx.setStorageSync('openid', result.openid)
    //           if(result.sid!=undefined){
    //             wx.setStorageSync('sid', result.sid)
    //             wx.switchTab({
    //               url: '/pages/index/index',
    //             })
    //           }
    //         }else{
    //           wx.showToast({
    //             title: "获取参数异常"
    //           })
    //         }
    //       }
    //     })
    //   },
    // })
  },
   
})