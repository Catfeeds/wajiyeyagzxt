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
  },
  tabClick (e) {
    this.setData({
      tabNum:e.target.dataset.id
    });
    if (e.target.dataset.id == 0){
      this.setData({
        supply: this.data.sale
      });
    }else{
      this.setData({
        supply: this.data.buy
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
          supply:res.data.sale,
          news:res.data.news,
          cname1: res.data.cname1,
          cname2: res.data.cname2,
          cname3:res.data.cname3,
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