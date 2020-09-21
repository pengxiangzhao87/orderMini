// pages/goods/add/add.js
var app = getApp()
Page({

  data: {
    baseUrl:'',
    goodsPic:[],
    videoUrl:'',
    goodsDesc:[],

    typeList:[],
    index:0,

    activeList:[],
    activeIdx:0,

    unitList:[
      {
        id:0,
        name:'重量'
      },{
        id:1,
        name:'个数'
      }
    ],
    unitIdx:0
  },
  onLoad:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    that.setData({
      baseUrl:baseUrl
    })
    wx.request({
      url: baseUrl+"commodity/queryCategoryList",
      method: 'get',
      success(res) {
        if(res.data.code==200){
          var list = res.data.data;
          //是否参加活动：0否，1时令水果，2新商品，3折扣
          var activeList = [];
          var one = {};
          one.isActive=0;
          one.name='否';
          activeList[0]=one;
          if(wx.getStorageSync('sId')==1){
            var two = {};
            two.isActive=1;
            two.name='时令水果';
            activeList[1]=two;
          }else{
            var three = {};
            three.isActive=2;
            three.name='新商品';
            activeList[1]=three;
          }
          var four = {};
          four.isActive=3;
          four.name='折扣';
          activeList[2]=four;
          that.setData({
            typeList:list,
            activeList:activeList
          })
        }
      } 
    })
  },
  /**
   * 组件的方法列表
   */
  onShow:function() {

  },
  changeType:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  changeActive:function(e){
    this.setData({
      activeIdx:e.detail.value
    })
  },
  changeUnit:function(e){
    this.setData({
      unitIdx:e.detail.value
    })
  },
  uploadPic:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var goodsPic = that.data.goodsPic;
        for(var idx in tempFilePaths){
          goodsPic.push(tempFilePaths[idx])
        }
        that.setData({
          goodsPic:goodsPic
        })
      }
    })
  },
  deletePic:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var goodsPic = that.data.goodsPic;
    goodsPic.splice(idx, 1);
    that.setData({
      goodsPic:goodsPic
    })
  },
  uploadDesc:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var goodsDesc = that.data.goodsDesc;
        for(var idx in tempFilePaths){
          goodsDesc.push(tempFilePaths[idx])
        }
        that.setData({
          goodsDesc:goodsDesc
        })
      }
    })
  },
  deleteDesc:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var goodsDesc = that.data.goodsDesc;
    goodsDesc.splice(idx, 1);
    that.setData({
      goodsDesc:goodsDesc
    })
  },
  uploadVideo:function(){
    var that = this;
    if(that.data.videoUrl!=''){
      wx.showToast({
        icon:'none',
        title: '只能传一个视频',
      })
      return;
    }
    wx.chooseVideo({
      success: function(res) {
        that.setData({
          videoUrl: res.tempFilePath,
        })
      }
    })

  },
  deleteVideo:function(){
    this.setData({
      videoUrl:''
    })
  },
  addGood:function(e){
    var that= this;
    var e = e.detail.value;
    if(e.sName==''){
      wx.showToast({
        icon:'none',
        title: '商品名称，不能为空'
      })
      return;
    }
    if(e.sPrice==''){
      wx.showToast({
        icon:'none',
        title: '商品价格，不能为空'
      })
      return;
    }
    if(e.sUnit==''){
      wx.showToast({
        icon:'none',
        title: '商品单位，不能为空'
      })
      return;
    }
    if(e.priceUnit==''){
      wx.showToast({
        icon:'none',
        title: '商品单价，不能为空'
      })
      return;
    }
    if(e.initNum==''){
      wx.showToast({
        icon:'none',
        title: '初始数量，不能为空'
      })
      return;
    }
    wx.showModal({
      content: '确定保存吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '上传中...',
          })
          var typeList = that.data.typeList;
          var index = that.data.index;
          e.tId = typeList[index].tId;
          var activeList = that.data.activeList;
          var activeIdx = that.data.activeIdx;
          e.isActive = activeList[activeIdx].isActive;
          var unitList = that.data.unitList;
          var unitIdx = that.data.unitIdx;
          e.initUnit = unitList[unitIdx].id;
          var baseUrl = that.data.baseUrl;
          wx.request({
            url: baseUrl+"commodity/addGoods",
            method: 'post',
            data:e,
            success(res) {
              if(res.data.code==200){
                var sId = res.data.data;
                that.uploadMulti(that,baseUrl,sId);
              }
            }
          })
        }
      }
    })

  },
  uploadMulti:function(that,baseUrl,sId){
    var goodsPic = that.data.goodsPic;
    var proPic;
    if(goodsPic.length>0){
      proPic = goodsPic.map((url, index) => {
          return new Promise(function(resolve, reject) {
            setTimeout(() => {
              wx.uploadFile({
                url: baseUrl+"commodity/addGoodsPic",
                filePath: url,
                name: 'file',
                formData: {'sId':sId},
                success: function(res) {
                  resolve(res.data);
                },
                fail: function(err) {
                  reject(new Error('failed to upload file'));
                }
              });
 
            }, 500)
          });
      });
    }
    var goodsDesc = that.data.goodsDesc;
    var proDesc;
    if(goodsDesc.length>0){
        proDesc = goodsDesc.map((url, index) => {
          return new Promise(function(resolve, reject) {
            setTimeout(() => {
              wx.uploadFile({
                url: baseUrl+"commodity/addGoodsDesc",
                filePath: url,
                name: 'file',
                formData: {'sId':sId},
                success: function(res) {
                  resolve(res.data);
                },
                fail: function(err) {
                  reject(new Error('failed to upload file'));
                }
              });
            }, 500)
          });
      });
    }
    var videoUrl = that.data.videoUrl;
    var proVideo;
    if(videoUrl!=''){
      proVideo =  new Promise(function(resolve, reject) {
        setTimeout(() => {
          wx.uploadFile({
            url: baseUrl+"commodity/addGoodsVideo",
            filePath: videoUrl,
            name: 'file',
            formData: {'sId':sId},
            success: function(res) {
              resolve(res.data);
            },
            fail: function(err) {
              reject(new Error('failed to upload file'));
            }
          });
        }, 500)
      });
    }
    
    var promise = Promise.all(proPic,proDesc,proVideo).then(function(results) {
      wx.hideLoading();
      that.onShow();
      wx.showModal({
        content: '保存成功',
        showCancel:false,
        success (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }).catch(function(err) {});



     
  }
   

})
