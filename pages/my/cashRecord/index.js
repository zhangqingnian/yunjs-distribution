// pages/my/cashRecord/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onWhy(){
        wx.showModal({
            content: '该账号安全认证未完成无法提现，请完成安全认证！',
            showCancel:false,
        })
    }
})