//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    hotData:true,
    brand:[],
    ggbottom:[],
    pro_list:[],
    tabNum:0,
    list1: [],
    list2: [],
    list3: [],
    list4:[],
    buy:[],
    sale:[],
    supply:[],
    news:[],
    cname1: '',
    cname2: '',
    cname3:'',
    gongpage: 1,
    qiupage: 1,
    showModalStatus:false,
    gong:[],
    qiu:[],
    phone:'',
    i:0,
    photo: '',
    dtype:0
  },
  // 上传图片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths;

        that.setData({
          imgs: imageSrc
        })
      }
    })

  },
  getPhone: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    });
  },
  //我要发布
  bindFormSubmit: function (e) {
    var that = this;
    var content = e.detail.value.content;
    var phone = that.data.phone;
    if (!content) {
      wx.showToast({
        title: '请输入供求内容！',
        duration: 2000
      });
      return false;
    }
    if (!phone) {
      wx.showToast({
        title: '请输入联系电话！',
        duration: 2000
      });
      return false;
    }
    that.setData({
      content: content
    });
    wx.showLoading({
      title: '发布中...',
    })
    that.upload();
  },
  upload: function () {
    var that = this;
    var imageSrc = that.data.imgs;
    var i = that.data.i;
    var length = imageSrc.length;
    wx.uploadFile({
      url: app.d.ceshiUrl + '/Api/User/uploadimg',
      filePath: imageSrc[i],
      name: 'data',
      success: function (res) {
        console.log('uploadImage success, res is:', res);
        that.setData({
          photo: that.data.photo.concat(res.data) + ',',
          i: that.data.i + 1,
        })
        if (that.data.i < length) {
          that.upload();
        } else {
          that.save();
        }
      },

      fail: function ({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
        return false;
      }
    })
  },
  save: function () {
    var that = this;
    var content = that.data.content;
    var phone = that.data.phone;
    var dtype = that.data.dtype;
    if (!content) {
      wx.showToast({
        title: '请输入供求内容！',
        duration: 2000
      });
      return false;
    }
    if (!phone) {
      wx.showToast({
        title: '请输入联系电话！',
        duration: 2000
      });
      return false;
    }
    console.log(dtype)
    if (dtype < 1 || dtype > 2) {
      wx.showToast({
        title: '网络异常，请稍后再试！',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/supply',
      method: 'post',
      data: {
        content: content,
        phone:phone,
        dtype: dtype,
        uid: app.d.userId,
        photo_x: that.data.photo
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.hideLoading();
          wx.showToast({
            title: '发布成功！',
            duration: 2000
          });
          that.setData({
            imgs: '',
            img_save: '',
            i: 0,
            photo: '',
            phone: '',
            content: '',
            showModalStatus: false
          });
          that.onShow();
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })



  },
  // 弹窗
  setModalStatus: function (e) {
    var dtype = e.currentTarget.dataset.dtype;
    this.setData({
      dtype: dtype
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  buttonClick (e) {
    var dtype = e.currentTarget.dataset.dtype;
    this.setData({
      showModalStatus: true,
      dtype: dtype
    })
  },
  setModalStatus (e) {
    this.setData({
      showModalStatus:false
    })
  },
  tabClick (e) {
    this.setData({
      tabNum:e.target.dataset.id
    });
    if (e.target.dataset.id == 0){
      this.setData({
        supply: this.data.gong
      });
    }else{
      this.setData({
        supply: this.data.qiu
      });
    }
  },

  call:function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  newsDetail:function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../news/news?newsId=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取首页信息
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          imgUrls: res.data.ggtop,
          ggbottom: res.data.ggbottom,
          list1: res.data.list1,
          list2: res.data.list2,
          list3: res.data.list3,
          list4:res.data.list4,
          buy:res.data.buy,
          sale:res.data.sale,
          news:res.data.news,
          cname1: res.data.cname1,
          cname2: res.data.cname2,
          cname3:res.data.cname3,
          supply: res.data.gong,
          gong:res.data.gong,
          qiu:res.data.qiu
        })
      }
    })
  },

  gotopro: function (e) {
    var brand_id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../listdetail/listdetail?brand_id=' + brand_id + '&name=' + name
    })
  },

  detail: function (e){
    var pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../product/product?productId=' + pid,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  //上一页
  lastpage: function (e) {
    var that = this;
    var ptype = e.currentTarget.dataset.ptype;
    if (ptype == 1) {
      var page = that.data.gongpage;
    } else {
      var page = that.data.qiupage;
    }
    if (page <= 1) {
      wx.showToast({
        title: '已经是第一页了！',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getpage',
      method: 'post',
      data: { page: page - 1, ptype: ptype },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '没有找到更多数据',
            duration: 2000
          });
          return false;
        }
        if (ptype == 1) {
          that.setData({
            gong: list,
            supply: list,
            gongpage: page - 1
          });
        } else {
          that.setData({
            qiu: list,
            supply: list,
            qiupage: page - 1
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  //下一页
  nextpage: function (e) {
    var that = this;
    var ptype = e.currentTarget.dataset.ptype;
    if (ptype == 1) {
      var page = that.data.gongpage;
    } else {
      var page = that.data.qiupage;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getpage',
      method: 'post',
      data: { page: page + 1, ptype: ptype },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '已经是最后一页了！',
            duration: 2000
          });
          return false;
        }
        if (ptype == 1) {
          that.setData({
            gong: list,
            supply: list,
            gongpage: page + 1
          });
        } else {
          that.setData({
            qiu: list,
            supply: list,
            qiupage: page + 1
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  suplyDetail: function (e) {
    var rid = e.currentTarget.dataset.rid;
    wx.navigateTo({
      url: '../suplyDetail/suplyDetail?rid=' + rid,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '挖机液压改装系统',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})