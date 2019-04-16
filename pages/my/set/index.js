// pages/my/set/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        arr: [{
            name: '使用说明',
            type: 0,
            url:'./use/index'
        }, {
            name: '关于斤斗云健身分销小程序',
            type: 1,
            url:'./about/index'
        }, {
            name: '营销协议',
            type: 2,
            url:'./protocol/index'
        }, {
            name: '关注斤斗云公众号',
            type: 3,
            url:'./public/index'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onSelect(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: item.url,
        })
       
    }
})