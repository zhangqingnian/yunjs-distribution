// pages/webviwe/index.js
import {
    config
} from '../../config.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let item = JSON.parse(options.item);
        console.log(item)
        this.setData({
            item
        })
    },
    onGoDetail(){
        wx.navigateTo({
            url: '/pages/taskList/index?id=' + this.data.item.commodityPackageId,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

        return {
            path: '/pages/webviwe/index?item=' + JSON.stringify(this.data.item)
        }
    }
})