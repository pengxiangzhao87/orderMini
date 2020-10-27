// pages/goods/goods.js
var util= require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    baseUrl:'',
    goodsList:[],
    typeList:[],
    index:0,
    sName:'',
    totalPage:0,
    page:1
  },
  onLoad:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    that.setData({
      baseUrl:baseUrl
    })
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('sId')==1?'田园生鲜':'水晶进口食品'
    })
    wx.request({
      url: baseUrl+"commodity/queryCategoryList",
      method: 'get',
      success(res) {
        if(res.data.code==200){
          var list = res.data.data;
          var item = {};
          item.tId=0;
          item.tName="全部";
          list.unshift(item);
          that.setData({
            typeList:list
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
  /**
   * 组件的方法列表
   */
  onShow:function() {
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras={};
    paras.tId = that.data.index;
    paras.tName = that.data.sName;
    paras.pId = wx.getStorageSync('sId');
    var page = that.data.page;
    paras.page = 1;
    paras.rows = page*20;
    wx.request({
      url: baseUrl+"commodity/queryGoods",
      data: paras,
      method: 'get',
      success(res) {
        if(res.data.code==200){
          var totalPage = res.data.data.totalPage;
          var total = that.data.totalPage;
          var pageAll = total==0?totalPage:total;
          var list = res.data.data.list;
          for(var index in list){
            list[index].isTouchMove = false;
          }
          that.setData({
            totalPage:pageAll,
            goodsList:list
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
  //上拉获取新数据
  onReachBottom:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var paras={};
    paras.tId = that.data.index;
    paras.tName = that.data.sName;
    paras.pId = wx.getStorageSync('sId');
    var page = that.data.page+1;
    paras.page = page;
    paras.rows = 20;
    wx.request({
      url: baseUrl+"commodity/queryGoods",
      data: paras,
      method: 'get',
      success(res) {
        if(res.data.code==200){
          var totalPage = res.data.data.totalPage;
          var total = that.data.totalPage;
          var pageAll = total==0?totalPage:total;
          var result = res.data.data.list;
          for(var index in result){
            result[index].isTouchMove = false;
          }
          var list = that.data.goodsList.concat(result);
          that.setData({
            totalPage:pageAll,
            goodsList:list,
            page:page
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
  changeType:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  checkOrder:function(e){
    var that = this;
    var name = e.detail.value.name;
    var baseUrl = that.data.baseUrl;
    var index = that.data.index;
    var paras={};
    paras.tId = index;
    paras.tName = name;
    paras.pId = wx.getStorageSync('sId')
    paras.page = 1;
    paras.rows = 20;
    wx.request({
      url: baseUrl+"commodity/queryGoods",
      data: paras,
      method: 'get',
      success(res) {
        if(res.data.code==200){
          that.setData({
            tId:index,
            sName:name,
            goodsList:res.data.data.list
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
  toOn:function(e){
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    wx.showModal({
      content: '确定上线吗',
      success (res) {
        if (res.confirm) {
          var baseUrl = that.data.baseUrl;
          var paras={};
          paras.sId = sid;
          paras.state = 1;
          wx.request({
            url: baseUrl+"commodity/updateState",
            data: paras,
            method: 'get',
            success(res) {
              that.onShow();
            },
            fail(res) {
              wx.showToast({
                icon:'none',
                title: '服务器异常'
              })
            }
          })
        }
      }
    })
    
  },
  toOff:function(e){
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    wx.showModal({
      content: '确定下线吗',
      success (res) {
        if (res.confirm) {
          var baseUrl = that.data.baseUrl;
          var paras={};
          paras.sId = sid;
          paras.state = 0;
          wx.request({
            url: baseUrl+"commodity/updateState",
            data: paras,
            method: 'get',
            success(res) {
              that.onShow();
            },
            fail(res) {
              wx.showToast({
                icon:'none',
                title: '服务器异常'
              })
            }
          })
        }
      }
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    var data = util.touchStart(e, this.data.goodsList)
    this.setData({
      goodsList: data
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    var data = util.touchMove(e, this.data.goodsList)
    this.setData({
      goodsList: data
    })
  },
  del:function(e){
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    wx.showModal({
      content: '确定删除吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据删除中...',
          })
          var baseUrl = that.data.baseUrl;
          var paras={};
          paras.sId = sid;
          paras.state = 0;
          wx.request({
            url: baseUrl+"commodity/deleteGoods",
            data: paras,
            method: 'get',
            success(res) {
              that.onShow();
              wx.showToast({
                icon:'none',
                title: '删除成功'
              })
            },
            fail(res) {
              wx.showToast({
                icon:'none',
                title: '服务器异常'
              })
            }
          })
        }
      }
    })
    
  },
  toAdd:function(){
    wx.navigateTo({
      url: '/pages/goods/add/add'
    })
  },
  clickRow:function(e){
    var sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '/pages/goods/update/update?sid='+sid
    })
  },

  showWin: function() {
    wx.navigateTo({
      url: '/pages/goods/setting/setting',
    })
   },
    
 

})
