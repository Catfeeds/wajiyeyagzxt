// pages/news/news.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    newsInfo:{},
    newsId: 0,
    title:''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var newsId = options.newsId;
    that.setData({
      newsId: newsId
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/News/detail2',
        method: 'post',
        data: { news_id: newsId},
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if(status==1){
            var news = res.data.info;
            var content = news.content;
            if(news){
              var title = news.name;
            }else{
              var title = '新闻资讯';
            }
            WxParse.wxParse('content', 'html', content, that, 3);
            that.setData({
              newsInfo: news,
              title:title
            });
          }else{
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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  //分享
  onShareAppMessage: function () {
    var title = this.data.title;
    var newsId = this.data.newsId;
    return {
      title: title,
      path: '/pages/news/news?newsId='+newsId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})