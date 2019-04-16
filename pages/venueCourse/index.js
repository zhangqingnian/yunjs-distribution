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
        show:false,
        imgUrl: config.base_img_url,
        course:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            options
        })
        let id = Number(options.id) || '';
        let venueGoodsId = Number(options.venueGoodsId)
        let packageId = Number(options.packageId);
        let entry = Number(options.entry);  //1 任务列表进入  2 我的名片进入
        let type = options.type;

        let received = options.received || 0;
        this._getCourseDetail({ id, venueGoodsId, packageId, type }, entry, received);
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    //去我的店铺
    onGoShop() {
        wx.navigateTo({
            url: '/pages/card/shop/index',
        })
    },
    //领用
    onUse() {
        let packageType = this.data.options.packageType;
        let packageId = this.data.options.packageId;
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
        if (!taskCode){
            wx.showToast({
                title: '请输入任务接取码!',
                icon:'none'
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
        let { id, venueGoodsId, packageId, customerId, nickName, type} = this.data.options;
        wx.navigateToMiniProgram({
            appId: 'wx58248eb6a6468f9c', // 要跳转的小程序的appid
            path: 'pages/share/venueCourseDetails/index?id=' + id + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + type + '&extend=yes', // 跳转的目标页面
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
    
    _getCourseDetail({ id, packageId, type, venueGoodsId }, entry, received) {
        let { latitude, longitude } = wx.getStorageSync('currentLocation');
        indexModel.getCourseDetail({
            id,
            packageId,
            type,
            venueGoodsId,
            lat: latitude,
            lon: longitude
        }, entry, received).then(res => {
            if (res.data.success) {
                let reslut = res.data.data;
                let classList = reslut.venueCourseClassVos;
                let fisrtId = classList[0].classId;
                classList.forEach((item, i) => {
                    if (i === 0) {
                        item.isOn = true
                    } else {
                        item.isOn = false
                    }
                })
                this._getClass(fisrtId)
                this.setData({
                    course: reslut,
                    classList: classList,
                    classId: fisrtId
                })    
            }
            console.log(res.data.data)
        })
    },
    //班级详情
    _getClass(id) {
        indexModel.getClass(id).then(res => {
            console.log(res);
            this.setData({
                classes: res.data.data
            })
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