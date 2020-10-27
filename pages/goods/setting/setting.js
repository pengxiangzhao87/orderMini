// pages/goods/setting/setting.js
var util= require('../../../utils/util.js');
var app = getApp()
Page({
  data: {
    baseUrl:'',
    supplier:{},
    showModal: false,
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
  onShow(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.request({
      url: baseUrl+"supplier/getSupplier",
      data: {'tId':wx.getStorageSync('sId')},
      method: 'get',
      success(res) {
        that.setData({
          supplier:res.data.data
        })
      }
    })
  },
  saveSupplier(e){
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.request({
      url: baseUrl+"supplier/uploadSupplier",
      method: 'post',
      data:e.detail.value,
      success(res) {
        if(res.data.code==200){
          wx.showModal({
            content: '保存成功',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  } 
})
