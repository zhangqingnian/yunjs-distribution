// pages/my/code/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:false,
        isOn:false,
        on: '/images/my/icon-on.png',
        off: '/images/my/icon-off.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onSelect(){
        this.setData({
            isOn:!this.data.isOn
        })
    }
})