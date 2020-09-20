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
    rowWW:0,
    totalPay:0,
    extraPay:0,
    extraBack:0,
    chargeback:0,
    chargebackPay:0,
    chargebackBack:0,
    totalGet:0
  },
  onUnload:function(){
    var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[ pages.length - 2 ];  
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      status:2
    })
    wx.navigateBack({
      delta: 1
    })
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
    var isHidden = that.data.isHidden;
    var baseUrl = app.globalData.baseUrl;
    var paras = {};
    paras.oId=that.data.oid;
    paras.sId=wx.getStorageSync('sId');
    wx.request({
      url: baseUrl+"order/selectPenderDetail",
      method: 'get',
      data: paras,
      success(res) {
        if(res.data.code==200){
          var data = res.data.data;
          var imageList = [];
          var totalPay = parseFloat(0);
          var extraPay = isHidden==0?(parseFloat(data[0].extra_status!=undefined?data[0].extra_payment:0)):parseFloat(0);
          var extraBack = isHidden==0?(parseFloat(data[0].back_price_status!=undefined?data[0].total_back_price:0)):parseFloat(0);
          var chargeback = parseFloat(0);
          var chargebackPay = parseFloat(0);
          var chargebackBack = parseFloat(0);
          for(var idx in data){
            var item = data[idx];
            var extra_img_url = item.extra_img_url;
            var image = {};
            image.id=item.id;
            totalPay += parseFloat(item.payment_price);
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
            //二次支付
            if(item.is_extra==2 && item.extra_pay_back_status!=undefined){
              chargebackPay += parseFloat(item.extra_price);
            }

            if(item.chargeback_status==2){
              //退款
              chargeback += parseFloat(item.payment_price);
              //补回商家返的差价
              if(item.is_extra==1 && item.back_price_status!=undefined ){
                chargebackBack += parseFloat(item.extra_price);
              }
            }
          }
          var totalGet =(totalPay+(data[0].extra_status==1?extraPay:0)-(data[0].back_price_status==2?extraBack:0)-chargeback-chargebackPay+chargebackBack).toFixed(2);
          totalPay = totalPay.toFixed(2);
          extraPay = extraPay.toFixed(2);
          extraBack = extraBack.toFixed(2);
          chargeback = chargeback.toFixed(2);
          chargebackPay = chargebackPay.toFixed(2);
          chargebackBack = chargebackBack.toFixed(2);
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList,
            totalPay:totalPay,
            extraPay:extraPay,
            extraBack:extraBack,
            chargeback:chargeback,
            chargebackPay:chargebackPay,
            chargebackBack:chargebackBack,
            totalGet:totalGet
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
  },
  copy:function(e){
    var oid = e.currentTarget.dataset.oid+'';
    wx.setClipboardData({
      data: oid,
      success (res) {}
    })
  } 
})
