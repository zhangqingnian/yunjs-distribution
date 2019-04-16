// pages/team/index.js
import {
    config
} from '../../config.js';
import {
    TeamModel
} from '../../models/team.js';
let teamModel = new TeamModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        teamList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        let token = wx.getStorageSync('token')
        let isBindMobile = token.bindingMobile;
        let accessToken = token.accessToken;
        if (!accessToken) {
            wx.showModal({
                title: '提示',
                content: '您还未登录,去登录!',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/authorize/index',
                        })
                    }
                }
            })
            return
        }

        if (!isBindMobile) {
            wx.showModal({
                title: '提示',
                content: '您还未绑定手机,去绑定!',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/bindMobile/index',
                        })
                    }
                }
            })

            return;
        }
        this._teamList()
    },
    goCode() {
        wx.navigateTo({
            url: '/pages/my/code/index?baseInfo=' + JSON.stringify({}),
        })
    },
    onMember(e){
        //saleOrTeam 1主管 0分销员
        let { id, teamName, saleOrTeam} = e.currentTarget.dataset.item;
        if (saleOrTeam == 1){
            wx.navigateTo({
                url: './myTeam/index?id=' + id + '&teamName=' + teamName,
            })
        } else if (saleOrTeam == 0){
            wx.navigateTo({
                url: './teamDetail/index?id=' + id + '&teamName=' + teamName,
            })
        }
        
    },
    _teamList() {
        teamModel.teamList().then(res => {
            console.log(res.data)
            this.setData({
                teamList: res.data.items,
                total:res.data.total
            })
        })
    }
})