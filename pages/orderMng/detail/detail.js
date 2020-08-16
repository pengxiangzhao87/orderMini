// pages/index/detail/detail.js
var app = getApp()
Page({
  data: {
    list:{},
    baseUrl:'',
    imageList:[],
    oid:0,
    isHidden:0
  },

  onLoad:function(e) {
    var isHidden = wx.getStorageSync('isHidden');
     this.setData({
       oid:e.oid,
       isHidden:isHidden
     })
  },
  onShow:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    var paras = {};
    paras.token=wx.getStorageSync('token');
    paras.oId=that.data.oid;
    wx.request({
      url: baseUrl+"order/selectOrderDetail",
      method: 'get',
      data: paras,
      success(res) {
        if(res.data.code==200){
          if(res.data.msg=='1'){
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
          var data = res.data.data;
          var imageList = [];
          for(var idx in data){
            var extra_img_url = data[idx].extra_img_url;
            var image = {};
            image.id=data[idx].id;
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
          }
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList
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
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  } 
})
