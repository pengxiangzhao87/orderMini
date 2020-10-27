// pages/goods/setting/setting.js
var util= require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    showModal: false,
    phone:''
  },

  /**
   * 组件的方法列表
   */
  onLoad:function() {
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    that.setData({
      baseUrl:baseUrl
    })
  },
  showWin: function() {
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.request({
      url: baseUrl+"supplier/getSupplier",
      data: {'tId':wx.getStorageSync('sId')},
      method: 'get',
      success(res) {
        that.setData({
          phone:res.data.data.sPhone,
          showModal: true
        })
      }
    })
   },
})
