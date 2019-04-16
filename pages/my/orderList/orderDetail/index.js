// pages/team/oderList/oderDetail/index.js
import {
    config
} from '../../../../config.js';
import { MyModel } from '../../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        order:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        this._orderDetail(id)
    },
    _orderDetail(id){
        wx.showLoading()
        myModel.orderDetail({
            id
        }).then(res => {
            wx.hideLoading();
            console.log(res)
            if(res.data.success){
                this.setData({
                    order:res.data.data
                })
            }
        })
    }
})