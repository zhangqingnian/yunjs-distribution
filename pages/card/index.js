// pages/card/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('onLoad')
    },

    onShare() {

    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/user?id=123'
        }
        /* 
        title	转发标题	当前小程序名称
        path	转发路径	当前页面 path ，必须是以 / 开头的完整路径
        imageUrl	自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。
                    显示图片长宽比是 5: 4。	使用默认截图	
        */
    }

})