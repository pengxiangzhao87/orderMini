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
    isExtraBack:0,
    backPrice:0,
    gray:true
  },

  onLoad:function(e) {
    var isHidden = wx.getStorageSync('isHidden');
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
          var isExtraBack = 0;
          var gray = true;
          var backPrice = parseFloat(0);
          for(var idx in data){
            var item = data[idx];
            var extra_img_url = item.extra_img_url;
            var image = {};
            image.id=item.id;
            //商家是否退还差价
            if(item.back_price_status!=undefined){
              isExtraBack=1;
            }else{
              isExtraBack=0;
              if(item.is_extra==1){
                gray=false;
              }
            }
            if(item.is_extra==1){
              backPrice += parseFloat(item.extra_price);
            }
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
          }
          console.info(data)
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList,
            isExtraBack:isExtraBack,
            backPrice:backPrice,
            gray:gray
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
            var isExtraBack = 0;
            var gray = true;
            var backPrice = parseFloat(0);
            for(var idx in data){
              var item = data[idx];
              var extra_img_url = item.extra_img_url;
              var image = {};
              image.id=item.id;
              if(item.total_back_price!=undefined){
                isExtraBack=1;
              }else{
                isExtraBack=0;
                if(item.is_extra==1){
                  gray=false;
                }
              }
              if(item.is_extra==1){
                backPrice += parseFloat(item.extra_price);
              }
              if(extra_img_url!=undefined && extra_img_url!=''){
                image.urlList = extra_img_url.split('~');
              }
              imageList[imageList.length]=image;
            }
            that.setData({
              list:data,
              baseUrl:baseUrl,
              imageList:imageList,
              isExtraBack:isExtraBack,
              backPrice:backPrice,
              gray:gray
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
    var flag = e.currentTarget.dataset.flag;
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var that = this;
    var baseUrl = that.data.baseUrl;
    var list = that.data.list;

    var item = list[idx];
    if(item.back_price_status!=undefined || (item.extra_status!=undefined && (item.is_extra==2 || flag==2)) || item.chargeback_status!=undefined){
      return; 
    }

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
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    var baseUrl = that.data.baseUrl;
    wx.showModal({
      content: '确定同意退款吗?',
      success (res) {
        if (res.confirm) {
          var param = {};
          param.id = id;
          param.oId = oid;
          wx.request({
            url: baseUrl+"order/agreeRefundDetail",
            method: 'get',
            data: param,
            success: function(res) {
              console.info(res)
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
      if(list[idx].total_back_price==undefined && list[idx].is_extra==1){
        wx.showToast({
          icon:'none',
          title: "有退还差价未处理"
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
        }
      }
    })
    
  },
  //返款
  toBackPrice:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    if(that.data.gray){
      return;
    }
    wx.showModal({
      content: '确定返还差价吗',
      success (res) {
        if (res.confirm) {
          var param = {};
          param.oId=that.data.oid;
          param.backPrice=that.data.backPrice;
          wx.request({
            url: baseUrl+"order/changeBackPrice",
            method: 'get',
            data: param,
            success: function(res) {
              if(res.data.code==200){
                var result = res.data.msg;
                wx.showToast({
                  icon:'none',
                  title: result,
                  success:function(){
                    setTimeout(function () {
                      that.onShow();
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
          })
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
    var id = e.currentTarget.dataset.id;
    var that = this;
    var list = that.data.list;
    for(var idx in list){
      var item = list[idx];
      if(item.id==id){
        item.extra_weight=value
        break;
      }
    }
    that.setData({
      list:list
    })
    var baseUrl = that.data.baseUrl;
    var param = {};
    param.id=id;
    param.value=value;
    wx.request({
      url: baseUrl+"order/updateExtraWeight",
      method: 'get',
      data: param,
      success: function(res) {
      }
    })
  },
  savePrice:function(e){
    var value = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var list = that.data.list;
    var backPrice = parseFloat(that.data.backPrice);
    for(var idx in list){
      var item = list[idx];
      if(item.id==id){
        backPrice -= parseFloat(item.extra_price);
        item.extra_price=value;
        break;
      }
    }
    backPrice += parseFloat(value);
    that.setData({
      list:list,
      backPrice:backPrice
    })
    var baseUrl = that.data.baseUrl;
    var param = {};
    param.id=id;
    param.value=value;
    wx.request({
      url: baseUrl+"order/updateExtraPrice",
      method: 'get',
      data: param,
      success: function(res) {
      }
    })
  }
})
