// pages/authorize/index.js
import {
    config
} from '../../config.js';


// 检测是否可以调用getUpdateManager检查更新


let updateManager = wx.getUpdateManager();
// 获取全局唯一的版本更新管理器，用于管理小程序更新
updateManager.onCheckForUpdate(function (res) {
    if (res.hasUpdate) {
        //如果有新版本                
        // 小程序有新版本，会主动触发下载操作        
        updateManager.onUpdateReady(function () {
            //当新版本下载完成，会进行回调          
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，单击确定重启小程序',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序               
                        updateManager.applyUpdate();
                    }
                }
            })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）        
        updateManager.onUpdateFailed(function () {
            //当新版本下载失败，会进行回调          
            wx.showModal({
                title: '提示',
                content: '检查到有新版本，但下载失败，请稍后尝试',
                showCancel: false,
            })
        })
    }
});

const app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    that.login();
                } 
            }
        })
    },
    bindGetUserInfo: function(e) {
        wx.removeStorageSync('token')
        let { encryptedData , iv} = e.detail
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            this.login(encryptedData, iv);          
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法后续使用，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权'
            })
        }
    },
    login(){
        let that = this;
        wx.login({
            success(res) {
                //先wx.login()获取code 然后发送请求
                if (res.code) {
                    //发起网络请求
                    wx.getUserInfo({
                        success(respone) {
                            let { encryptedData, iv } = respone;
                            that._login(res.code, encryptedData, iv)
                        }
                    });
                    
                } 
            }
        })
    },
    //发起请求
    _login(code, encryptedData,iv){
        wx.showLoading()
        wx.request({
            url: config.api_base_url + 'front/distributionMiniproWeChatLogin',
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },  
            data: {
                code,
                encryptedData,
                iv
            },
            success: res => {
                let reslut = res.data;
                console.log(res);
                if (reslut.code == "FOCUS_ON_THE_PUBLIC_NUMBER"){
                    this.setData({
                        codes: "FOCUS_ON_THE_PUBLIC_NUMBER"
                    })
                    wx.showToast({
                        title: reslut.msg,
                        icon:'none',
                        duration:5000
                    })
                    return
                }    
                if (reslut.success) {
                    //存token
                    wx.setStorageSync('token', reslut.data)
                    /*
                    reslut.data
                        accessToken:'daDSAD555555'   //token
                        accessTokenExpire:0         
                        bindingMobile:false       //是否绑定手机
                        openid:"ot0gZ48fETpD83uurJxqRxzQfsGQ"
                        refreshTokenExpire:0
                        session_key:"94qSR5xboX7c9a7QYdnXOA=="   //微信token
                        unionid:0
                    */
                    //是否绑定手机
                    if (!reslut.data.bindingMobile){
                        wx.navigateTo({
                            url: '/pages/bindMobile/index',
                        })
                        return
                    }
                    wx.navigateBack({
                        delta: 1,
                    })
                } else {
                    wx.showToast({
                        title: reslut.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }

                //授权成功后，跳转进入小程序首页
                // wx.switchTab({
                //     url: '/pages/index/index'
                // })
            },
            complete:res=> {
                wx.hideLoading();
            }
        })
    }
})