// pages/login/login.js
var app = getApp();
Page({
  /**
   * 组件的初始数据
   */
  data: {

  },
  onLoad:function(){
    var baseUrl = app.globalData.baseUrl;
    var paras= {};
    paras.account='tyxg';
    paras.password='tyxg2020';
    wx.request({
      url: baseUrl+"supplier/login",
      method: 'get',
      data: paras,
      success(res) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },fail(res){

      }
    })
  }

})
