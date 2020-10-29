// pages/orderMng/orderMng.js
var app = getApp()
Page({
  data: {
    baseUrl:'',
    orderList:Array,
    totalPage:0,
    paras:{}
  },
  onLoad:function(){
    var now = new Date();
    var month = now.getMonth()+1;
    var day = now.getDate();
    var nowDate = now.getFullYear() + '-' + (month<10?'0'+month:month) + '-' + (day<10?'0'+day:day);
    var paras = {};
    paras.startDate = nowDate;
    paras.endDate = nowDate;
    this.setData({
      baseUrl:app.globalData.baseUrl,
      paras:paras
    })
  },
  onShow: function () {
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras = that.data.paras;
    paras.sId=wx.getStorageSync('sId');
    paras.pageNo=1;
    paras.pageSize=20;
    that.getOrderList(that,baseUrl,paras);
  },
  getOrderList:function(that,baseUrl,paras){
    wx.request({
      url: baseUrl+"order/getOrderBySupplier",
      method: 'get',
      data: paras,
      success(res) {
        paras.startDate = paras.startDate.substring(0,10);
        paras.endDate = paras.endDate.substring(0,10);
        if(res.data.code==200){
          that.setData({
            orderList:res.data.data.list,
            totalPage:res.data.data.totalPage,
            paras:paras
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
  onReachBottom:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras = that.data.paras;
    if(paras.pageNo<that.data.totalPage){
      paras.pageNo = paras.pageNo+1;
      wx.request({
        url: baseUrl+"order/getOrderBySupplier",
        method: 'get',
        data: paras,
        success(res) {
          if(res.data.code==200){
            var result = that.data.orderList.concat(res.data.data.list);
            that.setData({
              orderList:result,
              paras:paras
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
    }
  },
  changeStart: function (e) {
    var that = this;
    var paras = that.data.paras;
    paras.startDate = e.detail.value
    that.setData({
      paras:paras
    })
  },
  changeEnd:function(e){
    var that = this;
    var paras = that.data.paras;
    paras.endDate = e.detail.value
    that.setData({
      paras:paras
    })
  },
  checkOrder:function(e){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras = {};
    paras.sId=wx.getStorageSync('sId');
    paras.startDate=e.detail.value.startDate+ ' 00:00:00';
    paras.endDate=e.detail.value.endDate+' 23:59:59';
    paras.name = e.detail.value.name;
    paras.phone=e.detail.value.phone;
    paras.oId = e.detail.value.oId;
    paras.pageNo =1;
    paras.pageSize=20;
    that.getOrderList(that,baseUrl,paras);
  },
  clickRow:function(e){
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var order = that.data.orderList[idx];
    var oid = order.o_id;
    var express = order.is_express;
    var type = order.express_type;
    var no = order.express_no;
    wx.navigateTo({
      url: '/pages/orderMng/detail/detail?oid='+oid+'&express='+express+'&type='+type+'&no='+no
    })
  }
})
 