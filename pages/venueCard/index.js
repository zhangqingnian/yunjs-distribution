// pages/venueCard/index.js
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
        time: [{
            name: '立即',
            value: 0,
            isOn: true
        }, {
            name: '1天',
            value: 1,
            isOn: false
        }, {
            name: '3天',
            value: 3,
            isOn: false
        }, {
            name: '7天',
            value: 7,
            isOn: false
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        this._getCardsDetail(id);
    },


    onShow: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    _getCardsDetail(id) {
        indexModel.getCardsDetail({
            id
        }).then(res => {
            if(res.data.success){
                this.setData({
                    card: res.data.data
                })
            }
            console.log(res.data.data)
        })
    }


})