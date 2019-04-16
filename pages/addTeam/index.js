// pages/addTeam/index.js

import { TeamModel } from '../../models/team.js';
let teamModel = new TeamModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isOn: false,
        on: '/images/my/icon-on.png',
        off: '/images/my/icon-off.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let teamCode = decodeURIComponent(options.scene);
        this.setData({
            teamCode
        })

    },
    onShow(){
        

        let token = wx.getStorageSync('token')
        let isBindMobile = token.bindingMobile;
        let accessToken = token.accessToken;
        //验证登录
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
        //验证绑定手机
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
    },
    //勾选协议
    onSelect() {
        this.setData({
            isOn: !this.data.isOn
        })
    },
    //取消加入团队
    onCancel() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    //确定加入团队
    onConfirm() {
        let isOn = this.data.isOn;
        if (!isOn) {
            wx.showToast({
                title: '请先阅读协议并勾选!',
                icon: 'none'
            })
            return
        }
        var teamCode = this.data.teamCode;
        console.log(teamCode)
        teamModel.joinTeam({
            teamCode
        }).then(res => {
            console.log(res)
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel:false,
                success:r => {
                    if (r.confirm) {
                        console.log('用户点击确定')
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    } 
                }
            })
            this.setData({
                isShow: false
            })
        })
    },
   
})