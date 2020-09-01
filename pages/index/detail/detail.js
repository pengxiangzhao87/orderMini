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
    backPrice:0,
    backGray:true,
    backHidden:false,
    payPrice:0,
    payGray:true,
    payHidden:false,
    rowWW:0
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
          var payPrice = parseFloat(0);
          var payGray = false;
          var backPrice = parseFloat(0);
          var backGray = false;
          var backHidden = true;
          var payHidden = true;
          for(var idx in data){
            var item = data[idx];
            var extra_img_url = item.extra_img_url;
            var image = {};
            image.id=item.id;
            if(extra_img_url!=undefined && extra_img_url!=''){
              image.urlList = extra_img_url.split('~');
            }
            imageList[imageList.length]=image;
            
            if(item.is_extra==1){
              item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
              item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
              //商家退还差价
              backPrice += parseFloat(item.extra_price);
              if(item.back_price_status!=undefined){
                backGray=true;
              }
              backHidden=false;
            }else if(item.is_extra==2){
              item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
              item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
              //用户补差价
              payPrice += parseFloat(item.extra_price);
              if(item.extra_status!=undefined){
                payGray=true;
              }
              payHidden=false;
            }
          }
          that.setData({
            list:data,
            baseUrl:baseUrl,
            imageList:imageList,
            payPrice:payPrice,
            payGray:payGray,
            payHidden:payHidden,
            backPrice:backPrice,
            backGray:backGray,
            backHidden:backHidden
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
            var payPrice = parseFloat(0);
            var payGray = false;
            var backPrice = parseFloat(0);
            var backGray = false;
            var backHidden = true;
            var payHidden = true;
            for(var idx in data){
              var item = data[idx];
              var extra_img_url = item.extra_img_url;
              var image = {};
              image.id=item.id;
              if(extra_img_url!=undefined && extra_img_url!=''){
                image.urlList = extra_img_url.split('~');
              }
              imageList[imageList.length]=image;
              
              if(item.is_extra==1){
                item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
                item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
                //商家退还差价
                backPrice += parseFloat(item.extra_price);
                if(item.back_price_status!=undefined){
                  backGray=true;
                }
                backHidden=false;
              }else if(item.is_extra==2){
                item.weightTip = item.extra_weight==0 || item.extra_weight==undefined?false:true;
                item.priceTip = item.extra_price==0 || item.extra_price==undefined?false:true;
                //用户补差价
                payPrice += parseFloat(item.extra_price);
                if(item.extra_status!=undefined){
                  payGray=true;
                }
                payHidden=false;
              }
            }
            that.setData({
              list:data,
              baseUrl:baseUrl,
              imageList:imageList,
              payPrice:payPrice,
              payGray:payGray,
              payHidden:payHidden,
              backPrice:backPrice,
              backGray:backGray,
              backHidden:backHidden
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
    param.id=id;
    param.isExtra=parseInt(flag);
    wx.request({
      url: baseUrl+"order/changeIsExtra",
      method: 'get',
      data: param,
      success: function(res) {
        if(res.data.code==200){
          that.onShow();
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
    var backPrice = that.data.backPrice;
    var backGray = that.data.backGray;
    var payPrice = that.data.payPrice;
    var payGray = that.data.payGray;
    if(backPrice!=0 && !backGray){
      return;
    }
    var content = '确定发货吗';
    if(payPrice!=0 && !payGray){
      content = '用户还未支付差价，确定发货吗';
    }
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
      content: content,
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
                if(res.data.msg=='1'){
                  wx.showToast({
                    icon:'none',
                    title: "有退款申请未处理",
                    success:function(){
                      setTimeout(function () {
                        that.onShow();
                      }, 1500);
                    }
                  })
                }else{
                  wx.showToast({
                    icon:'none',
                    title: '操作成功，已通知用户，请尽快发货',
                    success:function(){
                      setTimeout(function () {
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      }, 1500);
                    }
                  })
                }
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
    var backGray = that.data.backGray;
    var backPrice = that.data.backPrice;
    if(backGray || backPrice==0){
      return;
    }
    var list = that.data.list;
    console.info(list)
    for(var idx in list){
      var item = list[idx];
      if(item.is_extra==1 && (!item.weightTip || !item.priceTip) ){
        wx.showToast({
          icon:'none',
          title: '请完善退回信息',
          duration:1500
        })
        return;
      }
    }
    wx.showModal({
      content: '确定退回差价吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '退款中...',
          })
          var param = {};
          param.oId=that.data.oid;
          param.backPrice=backPrice;
          wx.request({
            url: baseUrl+"order/toBackPrice",
            method: 'get',
            data: param,
            success: function(res) {
              wx.hideLoading({
                complete: (res) => {},
              })
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
              wx.hideLoading({
                complete: (res) => {},
              })
              wx.showToast({
                title: "服务器异常"
              })
            }
          })
        }
      }
    })
  },
  toPayPrice:function(){
    var that = this;
    var baseUrl = that.data.baseUrl;
    var payGray = that.data.payGray;
    var payPrice = that.data.payPrice;
    if(payGray || payPrice==0){
      return;
    }
    var list = that.data.list;
    for(var idx in list){
      var item = list[idx];
      if(item.is_extra==2){
        if(!item.weightTip || !item.priceTip){
          wx.showToast({
            icon:'none',
            title: '请完善补差价信息',
            duration:1500
          })
          return;
        }
      }
    }
    wx.showModal({
      content: '确定让用户补差价吗',
      success (res) {
        if (res.confirm) {
          var param = {};
          param.oId=that.data.oid;
          param.payPrice=payPrice;
          param.orderTime = list[0].order_time;
          wx.request({
            url: baseUrl+"order/sendPayPrice",
            method: 'get',
            data: param,
            success: function(res) {
              if(res.data.code==200){
                wx.makePhoneCall({
                  phoneNumber: that.data.list[0].consignee_phone
                })
                that.onShow();
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
    var value = parseFloat(e.detail.value==''?0:e.detail.value).toFixed(2);
    var id = e.currentTarget.dataset.id;
    var that = this;
    var list = that.data.list;
    for(var idx in list){
      var item = list[idx];
      if(item.id==id){
        item.extra_weight=value;
        item.weightTip=value==0?false:true;
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
    var value = parseFloat(e.detail.value==''?0:e.detail.value).toFixed(2);
    var id = e.currentTarget.dataset.id;
    var that = this;
    var list = that.data.list;
    var backPrice = parseFloat(that.data.backPrice);
    for(var idx in list){
      var item = list[idx];
      if(item.id==id){
        backPrice -= parseFloat(item.extra_price);
        item.extra_price=value;
        item.priceTip=value==0?false:true;
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
