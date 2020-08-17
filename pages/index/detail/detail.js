// pages/index/detail/detail.js
var app = getApp()
Page({
  data: {
    list:{},
    baseUrl:'',
    imageList:[],
    oid:0,
    isHidden:0,


  },

  onLoad:function(e) {
    var isHidden = wx.getStorageSync('isHidden');
    console.info(e.oid)
     this.setData({
       oid:e.oid,
       isHidden:isHidden
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
  onPullDownRefresh:function(){
    var that = this;
    setTimeout(() => {
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
          wx.stopPullDownRefresh();
        },fail(res){
          wx.showToast({
            icon:'none',
            title: '服务器异常'
          })
          wx.stopPullDownRefresh();
        }
      })
    }, 1000);
    
  },
  changeExtra:function(e){
    var dis = e.currentTarget.dataset.dis;
    if(dis){
      wx.showToast({
        icon:'none',
        title: '已退款无法变更',
        duration:1500
      })
      return;
    }
    var id = e.currentTarget.dataset.id;
    var flag = e.currentTarget.dataset.flag;
    var that = this;
    var list = that.data.list;
    if(list[0].extra_status==1){
      return;
    }
    var baseUrl = that.data.baseUrl;
    var param = {};
    param.oid=list[0].o_id;
    param.id=id;
    param.isExtra=parseInt(flag);
    wx.request({
      url: baseUrl+"order/changeIsExtra",
      method: 'get',
      data: param,
      success: function(res) {
        if(res.data.code==200){
          if(res.data.msg=='1'){
            wx.showToast({
              icon:'none',
              title: '用户已支付差价，无法变更',
              success:function(){
                setTimeout(() => {
                  that.onShow();
                }, 1500);
              }
            })
          }else{
            that.onShow();
          }
        }else{
          wx.showToast({
            icon:'none',
            title: '服务器异常'
          })
        }
      },
      fail:function(res){
        wx.showToast({
          icon:'none',
          title: '服务器异常'
        })
      }
    })
  },
  uploadPic:function(e){
    var id = e.currentTarget.dataset.id;
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
          that.onShow();
          wx.showToast({
            title: '上传成功',
            duration:1000
          })
        }).catch(function(err) {
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
          wx.showToast({
            icon:'none',
            title: '删除成功',
            duration:1500
          })
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
  //退款
  agree:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.showModal({
      content: '确定同意退款吗?',
      success (res) {
        if (res.confirm) {
          var param = {};
          param.ids = id
          wx.request({
            url: baseUrl+"order/agreeRefundDetail",
            method: 'get',
            data: param,
            success: function(res) {
              if(res.data.code==200){
                that.onShow();
                wx.showToast({
                  title: '操作成功',
                  duration:1000
                })
                
              }else{
                wx.showToast({
                  title: "服务器异常"
                })
              }
            },
            fail: function(err) {
              wx.showToast({
                title: "服务器异常"
              })
            }
          });
        }
      }
    })
    
  },
  //确定发货
  sendGoods:function(){
    var that = this;
    var list = that.data.list;
    for(var idx in list){
      if(list[idx].chargeback_status==1){
        wx.showToast({
          icon:'none',
          title: "有退款申请未处理"
        })
        return;
      }
    }
    wx.showModal({
      content: '确定发货吗',
      success (res) {
        if (res.confirm) {
          var baseUrl = that.data.baseUrl;
          var oid = that.data.oid;
          var param = {};
          param.oId = oid;
          wx.request({
            url: baseUrl+"order/sendOrder",
            method: 'get',
            data: param,
            success: function(res) {
              if(res.data.code==200){
                wx.showToast({
                  icon:'none',
                  title: '操作成功，已通知用户，请尽快发货',
                  success:function(){
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    }, 2000);
                  }
                })
                
              }else{
                wx.showToast({
                  title: "服务器异常"
                })
              }
            },
            fail: function(err) {
              wx.showToast({
                title: "服务器异常"
              })
            }
          });
        } else if (res.cancel) {
           
        }
      }
    })
    
  },
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  saveWeight:function(e){
    var value = e.detail.value;
    console.info(value)
    var id = e.currentTarget.dataset.id;
    console.info(id)
  },
  savePrice:function(){
    var value = e.detail.value;
    console.info(value)
    var id = e.currentTarget.dataset.id;
    console.info(id)
  }
})
