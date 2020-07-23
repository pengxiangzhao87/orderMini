// pages/orderMng/orderMng.js

var app = getApp()
 
Page({
  data: {
     startDate:'',
     endDate:''
  },
  onLoad: function () {
    var now = new Date();
    var month = now.getMonth()+1;
    var nowDate = now.getFullYear() + '-' + (month<10?'0'+month:month) + '-' + now.getDate();
    this.setData({
      startDate:nowDate,
      endDate:nowDate
    })
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
  }
})
 