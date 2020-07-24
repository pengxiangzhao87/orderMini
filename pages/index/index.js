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
    // var that = this;
    // var baseUrl = that.data.baseUrl;
    // var paras= {};
    // paras.sId=1;
    // wx.request({
    //   url: baseUrl+"order/selectPendOrder",
    //   method: 'get',
    //   data: paras,
    //   success(res) {
    //     if(res.data.code==200){
    //       that.setData({
    //         orderList:res.data.data
    //       })
    //     }else{
    //       wx.showToast({
    //         icon:'none',
    //         title: '服务器异常'
    //       })
    //     }
    //   },fail(res){
    //     wx.showToast({
    //       icon:'none',
    //       title: '服务器异常'
    //     })
    //   }
    // })
  },
  toDetail:function(e){
    var oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/index/detail/detail?oid='+oid,
    })
  }
})
