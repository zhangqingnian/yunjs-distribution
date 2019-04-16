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
        show:false,
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
        card:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({options})
        let id =Number(options.id) || '';
        let venueGoodsId = Number(options.venueGoodsId)
        let packageId =Number(options.packageId);
        let entry = Number(options.entry);  //1 任务列表进入  2 我的名片进入
        let type =options.type;

        console.log(entry)
        let received = options.received || 0;
        this._getCardsDetail({ id, packageId, venueGoodsId, type }, entry, received);
    },


    onShow: function () {

    },
    //去我的店铺
    onGoShop(){
        wx.navigateTo({
            url: '/pages/card/shop/index',
        })
    },
    //领用
    onUse() {
        let packageType = this.data.options.packageType;
        let packageId = this.data.options.packageId;
        let isBindMobile = wx.getStorageSync('token').bindingMobile;
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
        //正常领取
        if (packageType == 1) {
            wx.showModal({
                title: '提示',
                content: '领用后请至【我的店铺】修改你的分销价格和建立你的分销团队',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        this._getTask({ packageId });
                    }
                }
            })

        }

        //指定领取
        if (packageType == 2) {
            this.setData({
                show: true
            })
        }
    },
    onInput(e) {
        let taskCode = e.detail.value.trim();
        if (!taskCode) {
            wx.showToast({
                title: '请输入任务接取码!',
                icon: 'none'
            })
            return
        }
        this.setData({
            taskCode
        })
    },
    cancelExchange() {
        this.setData({
            show: false
        })
    },
    confirmExchange() {
        let packageId = this.data.options.packageId;
        this._getTask({ packageId, taskCode: this.data.taskCode });
        this.setData({
            show: false
        })
    },
    onNavigateToMiniProgram() {
        // id, venueGoodsId, packageId, customerId, nickName, type 
        let { id, venueGoodsId, packageId, customerId, nickName, type } = this.data.options;
        console.log(this.data.options)
        wx.navigateToMiniProgram({
            appId: 'wx58248eb6a6468f9c', // 要跳转的小程序的appid
            path: 'pages/share/venueCardDetails/index?id='+ id + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + type +'&extend=yes', // 跳转的目标页面
            envVersion: 'trial',
            success(res) {
                // 打开成功  
                console.log(res);
            },
            fail(res) {
                console.log(res);
            }
        })
    },

    onSelectTime(e) {
        let { isOn, name } = e.currentTarget.dataset.item;
        var currentTime = '';
        if (!isOn) {
            let times = this.data.time;
            times.forEach(item => {
                if (item.name == name) {
                    item.isOn = true;
                    currentTime = item.value;
                } else {
                    item.isOn = false
                }
            })
            this.setData({
                time: times,
                currentTime: currentTime
            })
        }
    },
    onMap(e) {
        let {
            name,
            address,
            lat,
            lon
        } = e.currentTarget.dataset;
        wx.getLocation({ //获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({ //​使用微信内置地图查看位置。
                    latitude: Number(lat), //要去的纬度-地址
                    longitude: Number(lon), //要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    _getCardsDetail({ id, packageId, type, venueGoodsId }, entry, received) {
        let {latitude, longitude} = wx.getStorageSync('currentLocation');
        indexModel.getCardsDetail({
            id,
            venueGoodsId,
            packageId,
            lat: latitude,
            lon: longitude,
            type
        }, entry, received).then(res => {
            if(res.data.success){
                this.setData({
                    card: res.data.data
                })
            }
            console.log(res.data.data)
        })
    },
    //领用
    _getTask({ packageId, taskCode = '' }) {
        wx.showLoading();
        indexModel.getTask({
            packageId,
            taskCode
        }).then(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
                success: () => {
                    if (!res.data.success) return;
                    //领用成功后跳转我的店铺
                    wx.navigateTo({
                        url: '/pages/card/shop/index',
                    })
                }
            })
        })
    },

})