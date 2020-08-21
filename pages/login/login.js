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
    if(!wx.getStorageSync('token') || !wx.getStorageSync('isLogin') || wx.getStorageSync('isLogin')==0){
      that.userLogin(baseUrl);
    }else{
      wx.checkSession({
        success: function(){
          wx.switchTab({
            url: '/pages/index/index'
          })
        },
        fail: function(){
          //登录态过期
          //重新登录
          that.userLogin(baseUrl);
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
              wx.setStorageSync('isHidden', data.isHidden)
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
          wx.setStorageSync('isLogin', 1)
          wx.setStorageSync('isHidden', res.data.data.isHidden)
          wx.requestSubscribeMessage({
            tmplIds: ['oGUeI8FFPely9OFgNkukIKzlVQ7Ze8uiBQ5BIHCxLS0','HFb7VThCuI0TK8W38LR1oPTv8wL8dxzJKTeF11eUce4'],
            success (res) { 
              if(res['oGUeI8FFPely9OFgNkukIKzlVQ7Ze8uiBQ5BIHCxLS0-ZwAFL-b3kALcl0c']=='accept' && res['HFb7VThCuI0TK8W38LR1oPTv8wL8dxzJKTeF11eUce4']=='accept'){
                
              }
            }
          })
          wx.switchTab({
            url: '/pages/index/index'
          })
        }else{
          wx.showToast({
            title: "账号或密码有误"
          })
        }
       
      },fail(res){
        console.info(res)
        wx.showToast({
          title: "服务器异常"
        })
      }
    })
    
  }
})
