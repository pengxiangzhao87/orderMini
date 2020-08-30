// pages/index/detail/detail.js
var app = getApp()
Page({
  data: {
    list:{},
    baseUrl:'',
    imageList:[],
    oid:0,
    //0:田园鲜果，1：水晶进口
    isHidden:0,
    backPrice:0,
    backGray:true,
    backHidden:false,
    payPrice:0,
    payGray:true,
    payHidden:false,
    rowWW:0
  },

  onLoad:function(e) {
    var isHidden = wx.getStorageSync('isHidden');
    var ww = app.globalData.ww;
    var rowWW = ww-30-100;
     this.setData({
       oid:e.oid,
       isHidden:isHidden,
       rowWW:rowWW
     })
  },
  onShow:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    var paras = {};
    paras.oId=that.data.oid;
    paras.token=wx.getStorageSync('token');
    wx.request({
      url: baseUrl+"order/selectPenderDetail",
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
          var payPrice = parseFloat(0);
          var payGray = false;
          var backPrice = parseFloat(0);
          var backGray = false;
          var backHidden = true;
          var payHidden = true;
          for(var idx in data){
            var item = data[idx];
            var extra_img_url = item.extra_img_url;
            var image = {};
            image.id=item.id;
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
            
            if(item.is_extra==1){
              item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
              item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
              //商家退还差价
              backPrice += parseFloat(item.extra_price);
              if(item.back_price_status!=undefined){
                backGray=true;
              }
              backHidden=false;
            }else if(item.is_extra==2){
              item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
              item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
              //用户补差价
              payPrice += parseFloat(item.extra_price);
              if(item.extra_status!=undefined){
                payGray=true;
              }
              payHidden=false;
            }
          }
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList,
            payPrice:payPrice,
            payGray:payGray,
            payHidden:payHidden,
            backPrice:backPrice,
            backGray:backGray,
            backHidden:backHidden
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
