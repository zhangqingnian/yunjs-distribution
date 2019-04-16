// pages/team/teamDetail/index.js
import {
    config
} from '../../../config.js';
import {
    TeamModel
} from '../../../models/team.js';
let teamModel = new TeamModel();
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
        let teamId = options.id;
        let teamName = options.teamName;
        this.setData({
            teamName
        })
        this._saleUser({ teamId});
    },
    goShop(){
        wx.navigateTo({
            url: '/pages/card/shop/index',
        })
    },
    onOrder(e) {
        let item = e.currentTarget.dataset.item;
        console.log(item)
        wx.navigateTo({
            url: '../oderList/index?item=' + JSON.stringify(item),
        })
    },
    _saleUser({ start = 0, limit = 20, teamId}){
        teamModel.saleUser({
            teamId,
            start,
            limit
        }).then(res => {
            console.log(res);
            this.setData({
                total: res.data.total,
                saleUserList: res.data.items
            })
        })
    }
})