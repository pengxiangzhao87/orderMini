// pages/goods/update/update.js
var app = getApp()
Page({

  data: {
    list:{},
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
  onLoad:function(e){
    var that = this;
    var baseUrl = app.globalData.baseUrl;
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
            baseUrl:baseUrl,
            typeList:list,
            activeList:activeList
          })
        }
      } 
    })
    wx.request({
      url: baseUrl+"commodity/queryOneGoods",
      method: 'get',
      data:{'sId':e.sid},
      success(res) {
        if(res.data.code==200){
          var list = res.data.data;
          var imgList = list.sAddressImg.split('~');
          var img = [];
          for(var idx in imgList){
            var item = imgList[idx];
            img[idx]=baseUrl+'upload/'+item;
          }
          
          var desc = [];
          if(list.sDesc!=undefined && list.sDesc!=''){
            var descList = list.sDesc.split('~');
            for(var idx in descList){
              var item = descList[idx];
              desc[idx]=baseUrl+'upload/'+item;
            }
          }
          
          var index = list.tId-1;
          var activeIdx=list.isActive==3?2:list.isActive;
          var unitIdx=list.initUnit;
          var videoUrl = (list.sAddressVideo==undefined || list.sAddressVideo=='')?'':baseUrl+'upload/'+list.sAddressVideo;
          that.setData({
            goodsPic:img,
            goodsDesc:desc,
            videoUrl:videoUrl,
            unitIdx:unitIdx,
            activeIdx:activeIdx,
            index:index,
            list:list
          })
           
        }
      }
    })
  },
  onShow:function() {
    
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
  updateGood:function(e){
    var that= this;
    var e = e.detail.value;
    if(e.sName==''){
      wx.showToast({
        icon:'none',
        title: '商品名称，不能为空'
      })
      return;
    }
    if(that.data.activeIdx==2 && e.originalPrice==''){
      wx.showToast({
        icon:'none',
        title: '商品原价，不能为空'
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
    if(that.data.goodsPic.length==0){
      wx.showToast({
        icon:'none',
        title: '请上传商品图片，不能为空'
      })
      return;
    }
    wx.showModal({
      content: '确定保存修改吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据上传中...',
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
          e.pId = wx.getStorageSync('sId');
          if(that.data.activeIdx!=2){
            e.originalPrice='';
          }
          var baseUrl = that.data.baseUrl;
          var list = that.data.list;
          var sAddressImg = list.sAddressImg;
          //删除的文件
          var deletePic = "";
          //商品图片地址
          var goodsPic = that.data.goodsPic;
          var keepPic = "";
          var tmpPic = [];
          for(var idx in goodsPic){
            var item = goodsPic[idx];
            if(item.indexOf("tmp") == -1){
              var orginal = item.replace(baseUrl+"upload/","");
              keepPic += orginal +'~';
              sAddressImg = sAddressImg.replace(orginal+"~","");
              sAddressImg = sAddressImg.replace("~"+orginal,"");
              sAddressImg = sAddressImg.replace(orginal,"");
            }else{
              tmpPic.push(item);
            }
          }
          goodsPic = tmpPic;
          e.sAddressImg = keepPic==''?'':keepPic.substring(0,keepPic.length-1);
          deletePic += sAddressImg==''?'':(sAddressImg + "~");
          //商品描述地址
          var sDesc = list.sDesc;
          var goodsDesc = that.data.goodsDesc;
          var keepDesc = "";
          var tepDesc = [];
          for(var idx in goodsDesc){
            var item = goodsDesc[idx];
            if(item.indexOf("tmp") == -1){
              var orginal = item.replace(baseUrl+"upload/","");
              keepDesc += orginal +'~';
              sDesc = sDesc.replace(orginal,"");
              sDesc = sDesc.replace(orginal+"~","");
              sDesc = sDesc.replace("~"+orginal,"");
            }else{
              tepDesc.push(item);
            }
          }
          goodsDesc = tepDesc;
          e.sDesc = keepDesc==''?'':keepDesc.substring(0,keepDesc.length-1);
          deletePic += sDesc==""?"":(sDesc + "~");
          //视频地址
          var sAddressVideo = list.sAddressVideo;
          var videoUrl = that.data.videoUrl;
          if(sAddressVideo!="" && sAddressVideo!=undefined){
            if(videoUrl!='' && videoUrl.indexOf("tmp")==-1){
              videoUrl="";
            }else{
              deletePic += list.sAddressVideo + "~";
              e.sAddressVideo="";
            }
            
          }
          //删除的文件
          deletePic = deletePic.substring(0,deletePic.length-1);
          var baseUrl = that.data.baseUrl;
          wx.request({
            url: baseUrl+"commodity/updateGoods",
            method: 'post',
            data:{"delete":deletePic,"model":e},
            success(res) {
              if(res.data.code==200){
                that.uploadMulti(that,baseUrl,e.sId,goodsPic,goodsDesc,videoUrl);
              }
            }
          })
        }
      }
    })

  },
  uploadMulti:function(that,baseUrl,sId,goodsPic,goodsDesc,videoUrl){
    var proPic = '';
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
    var proDesc='';
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
    var proVideo='';
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
    
      Promise.all(proPic,proDesc,proVideo).then(function(results) {
        wx.hideLoading();
        wx.showModal({
          content: '修改成功',
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
    
    
     
  },
  enlargementPic:function(e){
    var url = e.currentTarget.dataset.url;
    var that = this;
    var goodsPic = that.data.goodsPic;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: goodsPic // 需要预览的图片http链接列表
    })
  },

  enlargementDesc:function(e){
    var url = e.currentTarget.dataset.url;
    var that = this;
    var goodsDesc = that.data.goodsDesc;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: goodsDesc // 需要预览的图片http链接列表
    })
  },
  hideBoard:function(){
    wx.hideKeyboard();
  }
})
