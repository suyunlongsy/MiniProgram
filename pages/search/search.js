//search.js
//获取应用实例
var app = getApp()
Page({
  onLoad: function () {
    //调用应用实例的方法获取全局数据
  },
  onShow: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    })
  },
  data: {
    inputShowed: false,
    inputVal: "",
    longtab: false,
    resArray: [],
    target: {},
    hasIn: false
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value,
      resArray: []
    });
  },
  getRes: function () {
    var that = this;
    // var regCapitalLetter = new RegExp('^[a-zA-Z0-9]+$', 'g');
    if (this.data.inputVal == ''){
      return;
    }
    // console.log('正则');
    // console.log(regCapitalLetter.exec(this.data.inputVal));
    wx.showLoading({
      title: '搜索中'
    })
    
    wx.request({
      url: 'https://suyunlong.top/mini/search',
      data: {
        s: that.data.inputVal
      },
      success: function (res) {
          let data = res.data;
          console.log(data);
          if(!data){
            wx.showToast({
              title: '请换个关键字搜索',
              icon: 'loading',
              duration: 1500
            })
            console.log('data为否');
            return;
          }
          that.setData({
            resArray: data
          })
          wx.hideLoading();
      },
      fail: function () {
        wx.showLoading({
          title: '搜索失败',
          duration: 1000
        })
      },
      complete: function () {
    
      }
     })
  },
  bindPickerChange: function (e) {
    console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  play: function (e) {
    var that = this;
    var data = e.currentTarget.dataset;
    if (this.endTime - this.startTime < 350) {
      app.playMusic(data.id, data);
    } else {
      console.log('longtab');
      that.setData({
        target: data
      })
      console.log(that.data.target);
      wx.showModal({
        title: '这首还不错，不如添加到我的歌单',
        success: function (res) {
          if (res.confirm) {
            //循环现有歌单，判断是否重复
            app.globalData.userList.forEach((v, i, a) => {
              if (v.id == data.id) {
                wx.showToast({
                  title: '歌单中已存在',
                  duration: 2000
                })
                that.setData({
                  hasIn: true
                })
                return;
              }
            })
            if(that.data.hasIn) return;
            console.log('未重复');
            app.addNewSong(data);
            //判断是不是游客，游客的话，不向后台发送数据
            if (app.globalData.isTourist) {
              console.log('游客');
              return;
            }
            console.log('不是游客');
            app.addToMyList(data);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        complete: function () {
          that.setData({
            hasIn: false
          })
        }
      })
    }
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
    console.log('start' + this.startTime);
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    console.log('end' + this.endTime);
  }
})
