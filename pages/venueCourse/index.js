// pages/venueCourse/index.js
import {
    config
} from '../../config.js';
import {
    IndexModel
} from '../../models/index.js';
let indexModel = new IndexModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        this._getCourseDetail(id);
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /*
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    _getCourseDetail(id) {
        indexModel.getCourseDetail({
            id
        }).then(res => {
            if (res.data.success) {
                this.setData({
                    card: res.data.data
                })
            }
            console.log(res.data.data)
        })
    }
})