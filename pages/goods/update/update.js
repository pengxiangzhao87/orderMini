// pages/goods/update/update.js
var app = getApp()
Page({

  data: {
    list:{},
    baseUrl:'',
    goodsPic:[],
    videoUrl:'',
    goodsDesc:[],
    sId:0,

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
  onLoad:function(e){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    that.setData({
      baseUrl:baseUrl,
      sId:e.sid
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
  onShow:function() {
    var that = this;
    var baseUrl = that.data.baseUrl;
    var sid = that.data.sId;
    wx.request({
      url: baseUrl+"commodity/queryOneGoods",
      method: 'get',
      data:{'sId':sid},
      success(res) {
        if(res.data.code==200){
          var list = res.data.data;
          var imgList = list.sAddressImg.split('~');
          var img = [];
          for(var idx in imgList){
            var item = imgList[idx];
            img[idx]=baseUrl+'upload/'+item;
          }
          list.goodsPic = img;
          var descList = list.sDesc.split('~');
          var desc = [];
          for(var idx in descList){
            var item = descList[idx];
            desc[idx]=baseUrl+'upload/'+item;
          }
          list.goodsDesc = desc;
          var index = list.tId-1;
          var activeIdx=list.isActive;
          var unitIdx=list.initUnit;
          var videoUrl = list.sAddressVideo==''?'':baseUrl+'upload/'+list.sAddressVideo;
          that.setData({
            videoUrl:videoUrl,
            goodsDesc:desc,
            goodsPic:img,
            unitIdx:unitIdx,
            activeIdx:activeIdx,
            index:index,
            list:list
          })
           
        }
      }
    })
  },
  changeType:function(e){
    var that = this;
    var value = e.detail.value;
    var list = that.data.list;
    list.tId = value+1;
    that.setData({
      list:list,
      index:value
    })
  },
  changeActive:function(e){
    var that = this;
    var value = e.detail.value;
    var list = that.data.list;
    list.isActive=value;
    that.setData({
      list:list,
      activeIdx:value
    })
  },
  changeUnit:function(e){
    var that = this;
    var value = e.detail.value;
    var list = that.data.list;
    list.initUnit=value;
    that.setData({
      list:list,
      unitIdx:value
    })
  },
  uploadPic:function(){
    var that = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var list = that.data.list;
        var imgList = list.sAddressImg;
        var goodsPic = that.data.goodsPic;
        console.info(goodsPic)
        for(var idx in tempFilePaths){
          goodsPic.push(tempFilePaths[idx]);
          if(imgList==''){
            imgList += tempFilePaths[idx];
          }else{
            imgList += '~'+tempFilePaths[idx];
          }
        }
        list.sAddressImg = imgList;
        console.info(goodsPic)
        that.setData({
          list:list,
          goodsPic:goodsPic
        })
        console.info(that.data.goodsPic)
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
    wx.showModal({
      content: '确定保存吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '上传中...',
          })
          e.tId = that.data.index;
          e.isActive = that.data.activeIdx;
          e.initUnit = that.data.unitIdx;
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
