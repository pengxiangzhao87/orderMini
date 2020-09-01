// pages/orderMng/orderMng.js

var app = getApp()
 
Page({
  data: {
     startDate:'',
     endDate:'',
     orderList:Array,
     totalPage:0,
     paras:{}
  },
  onLoad:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl
    })
  },
  onShow: function () {
    var that = this;
    var baseUrl = that.data.baseUrl;
    var now = new Date();
    var month = now.getMonth()+1;
    var nowDate = now.getFullYear() + '-' + (month<10?'0'+month:month) + '-' + now.getDate();
    that.setData({
      startDate:'2020-01-01',
      endDate:nowDate
    })
    var paras = {};
    paras.sId=wx.getStorageSync('sId');
    paras.startDate='2020-01-01';
    paras.endDate=nowDate;
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
    this.setData({
      startDate:e.detail.value
    })
  },
  changeEnd:function(e){
    this.setData({
      endDate:e.detail.value
    })
  },
  checkOrder:function(e){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras = {};
    paras.sId=wx.getStorageSync('sId');
    paras.startDate=e.detail.value.startDate;
    paras.endDate=e.detail.value.endDate;
    paras.sName = e.detail.value.name;
    paras.pageNo =1;
    paras.pageSize=20;
    that.getOrderList(that,baseUrl,paras);
  },
  clickRow:function(e){
    var oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/orderMng/detail/detail?oid='+oid
    })
  }
})
 