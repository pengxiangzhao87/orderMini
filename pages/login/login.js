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
    this.setData({
      baseUrl:app.globalData.baseUrl
    })
  },
  login:function(e){
    var baseUrl = this.data.baseUrl;
    var account = e.detail.value.account;
    var pwd = e.detail.value.pwd;
    var paras = {};
    paras.account = account;
    paras.password = pwd;
    paras.openid = wx.getStorageSync('openid');
    wx.request({
      url: baseUrl+"supplier/login",
      method: 'get',
      data: paras,
      success(res) {
        console.info(res)
        if(res.data.code==200){
          wx.setStorageSync('sid', res.data.data)
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
        wx.showToast({
          title: "服务器异常"
        })
      }
    })
    
  }
})
