// pages/send/send.js
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
    paras.status=2;
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
    var oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/orderMng/detail/detail?oid='+oid,
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
  },
  confirmSend:function(e){
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.showModal({
      content: '确认送达吗?',
      success (res) {
        if (res.confirm) {
          var paras = {};
          paras.oId = oid;
          paras.sId=wx.getStorageSync('sId')
          wx.request({
            url: baseUrl+"order/confirmSend",
            method: 'get',
            data: paras,
            success(res) {
              wx.showToast({
                icon:'none',
                title: '状态已变更',
              })
              that.onShow();
            },fail(){
              wx.showToast({
                icon:'none',
                title: '服务器异常'
              })
            }
          })
        }
      }
    })
    
  }
})
