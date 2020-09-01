// pages/login/login.js
var app = getApp();
Page({
  /**
   * 组件的初始数据
   */
  data: {
    baseUrl:''
  },
  onLoad:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    that.setData({
      baseUrl:baseUrl
    })
    if(!wx.getStorageSync('sId')){
      that.userLogin(baseUrl);
    }else{
      wx.switchTab({
        url: '/pages/index/index'
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
              wx.setStorageSync('isHidden', data.isHidden)
              if(data.sId!=undefined){
                wx.setStorageSync('sId', data.sId);
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
  login:function(e){
    var baseUrl = this.data.baseUrl;
    var account = e.detail.value.account;
    var pwd = e.detail.value.pwd;
    var paras = {};
    paras.account = account;
    paras.password = pwd;
    paras.token = wx.getStorageSync('token');
    wx.request({
      url: baseUrl+"supplier/login",
      method: 'get',
      data: paras,
      success(res) {
        if(res.data.code==200){
          wx.setStorageSync('sId', res.data.data.sId);
          wx.setStorageSync('isHidden', res.data.data.isHidden);
          wx.switchTab({
            url: '/pages/index/index'
          })
        }else{
          wx.showToast({
            title: "账号或密码有误"
          })
        }
       
      },fail(res){
        wx.showToast({
          title: "服务器异常"
        })
      }
    })
    
  }
})
