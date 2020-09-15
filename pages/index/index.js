//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    orderList:[]
  },

  onLoad: function () {
    this.setData({
      baseUrl:app.globalData.baseUrl
    })
   
  },
  onShow(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras= {};
    paras.status=1;
    paras.sId=wx.getStorageSync('sId');
    wx.request({
      url: baseUrl+"order/selectPendOrder",
      method: 'get',
      data: paras,
      success(res) {
        if(res.data.code==200){
          that.setData({
            orderList:res.data.data
          })
        }else{
          wx.showToast({
            icon:'none',
            title: '服务器异常'
          })
        }
      },fail(res){
        wx.showToast({
          icon:'none',
          title: '服务器异常'
        })
      }
    })
  },
  toDetail:function(e){
    wx.getSetting({
      withSubscriptions: true,
      complete(res){
        if(typeof(res.subscriptionsSetting.itemSettings)=='object' ){
          var oid = e.currentTarget.dataset.oid;
          wx.navigateTo({
            url: '/pages/index/detail/detail?oid='+oid,
          })
        }else{
          wx.requestSubscribeMessage({
            tmplIds: ['fSY6OIzxAN8Ru7aFUNvwBUD80i561FaqwzkwIG_sNJQ','94fg3W3PWhDWzpZ_W5upX3megk0dxBL47w9w0SsmAKo','6Pcxa3JKbmABTMowyVr_8hACo9u3xiAm3p80Y6DIycQ'],
            complete (res) { 
              var oid = e.currentTarget.dataset.oid;
              wx.navigateTo({
                url: '/pages/index/detail/detail?oid='+oid,
              })
            }
          })
        }
      }
    })
   
  },
  onPullDownRefresh:function(){
    this.onShow();
    wx.stopPullDownRefresh();
  },
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  copy:function(e){
    var oid = e.currentTarget.dataset.oid+'';
    wx.setClipboardData({
      data: oid,
      success (res) {}
    })
  }
})
