// pages/index/detail/detail.js
var app = getApp()
Page({
  data: {
    list:{},
    baseUrl:'',
    imageList:[],
    oid:0,
    extraList:[]
  },

  onLoad:function(e) {
     this.setData({
       oid:e.oid
     })
  },
  onShow:function(){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    var paras = {};
    paras.oId=that.data.oid;
    wx.request({
      url: baseUrl+"order/selectPenderDetail",
      method: 'get',
      data: paras,
      success(res) {
        if(res.data.code==200){
          var data = res.data.data;
          console.info(data)
          var imageList = [];
          var extraList = [];
          for(var idx in data){
            var extra_img_url = data[idx].extra_img_url;
            var image = {};
            image.id=data[idx].id;
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
            var item={};
            item.id=data[idx].id;
            item.none=true;
            item.back=false;
            item.pay=false;
            extraList[extraList.length]=item;
          }
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList,
            extraList:extraList
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
  changeExtra:function(e){
    var id = e.currentTarget.dataset.id;
    var flag = e.currentTarget.dataset.flag;
    var that = this;
    var extraList = that.data.extraList;
    for(var idx in extraList){
      var item = extraList[idx];
      if(item.id==id){
        item.none=flag==0;
        item.back=flag==1;
        item.pay=flag==2;
      }
    }
    that.setData({
      extraList:extraList
    })

  },
  uploadPic:function(e){
    var id = e.currentTarget.dataset.id
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中',
        })
        var promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
            return new Promise(function(resolve, reject) {
              setTimeout(() => {
              wx.uploadFile({
                url: baseUrl+"order/uploadPics",
                filePath: tempFilePath,
                name: 'file',
                formData: {'id':id},
                success: function(res) {
                  resolve(res.data);
                },
                fail: function(err) {
                  reject(new Error('failed to upload file'));
                }
              });
              }, 500)
            });
        }));
        promise.then(function(results) {
          wx.hideLoading({});
          wx.showToast({
            title: '上传成功',
            success:function(){
              setTimeout(function () {
                that.onShow();
              }, 1000);
            }
          })
        }).catch(function(err) {
          console.log(err);
        });
      }
    })
  },
  deletePic:function(e){
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var baseUrl = that.data.baseUrl;
    var param = {};
    param.id=id;
    param.url=url
    param.idx=idx;
    wx.request({
      url: baseUrl+"order/deletePic",
      method: 'get',
      data: param,
      success: function(res) {
        if(res.data.code==200){
          that.onShow();
        }else{
          wx.showToast({
            title: "删除失败"
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: "服务器异常"
        })
      }
    });
  },
  sendGoods:function(){

  }
})
