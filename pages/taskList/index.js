// pages/taskList/index.js
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
        task:{},
        show:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this.setData({
            id
        })
    },
    onShow(){
        this._getTaskList(this.data.id);
    },
    //领用
    onUse(){
        let packageType = this.data.task.packageType;
        let token = wx.getStorageSync('token')
        let isBindMobile =token.bindingMobile;
        let accessToken = token.accessToken;
        if(!accessToken){
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

        if (!isBindMobile){
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
                showCancel:false,
                success:(res) => {
                    if (res.confirm) {
                        this._getTask({ packageId: this.data.id });       
                    }
                }
            })
            
        }

        //指定领取
        if (packageType == 2){
            this.setData({
                show:true
            })
        }
        

    },
    onGodetail(e){
        var item = e.currentTarget.dataset.item;
        console.log(item);
        let packageType = this.data.task.packageType;
        let packageId = this.data.id;
        let entry = 1;  //任务列表进入详情的标志
        //type 1 课程  
        if(item.type == 1){
            let url = '/pages/venueCourse/index?packageId=' + packageId + '&id=' + item.id + '&entry=' + entry + '&type=' + '' + '&venueGoodsId=' + item.venueGoodsId + '&received=' + this.data.task.received + '&packageType=' + packageType; 
            wx.navigateTo({
                url
            })           
        }
        //type 2 馆卡
        if (item.type == 2) {
            let url = '/pages/venueCard/index?packageId=' + packageId + '&id=' + item.id + '&entry=' + entry + '&type=' + '' + '&venueGoodsId=' + item.venueGoodsId + '&received=' + this.data.task.received + '&packageType=' + packageType;  
            wx.navigateTo({
                url
            })     
        }

        
    },
    onInput(e){
        let taskCode = e.detail.value.trim();
        this.setData({
            taskCode
        })
    },
    cancelExchange(){
        this.setData({
            show:false
        })
    },
    confirmExchange(){
        this._getTask({ packageId:this.data.id, taskCode:this.data.taskCode});
        this.setData({
            show: false
        })
    },
    //领用
    _getTask({ packageId, taskCode = ''}){
        wx.showLoading();
        indexModel.getTask({
            packageId,
            taskCode
        }).then(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
                icon:'none',
                success: () => {
                    if (!res.data.success) return;
                    //领用成功后跳转我的店铺
                    wx.navigateTo({
                        url: '/pages/card/shop/index',
                    })
                }
            })
            //this._getTaskList(this.data.id)
            console.log(res)
        })
    },
    _getTaskList(id){
        let { latitude, longitude } = wx.getStorageSync('currentLocation');
        indexModel.getTaskList({
            id,
            lat: latitude,
            lon: longitude
        }).then(res => {
            if(!res.data.success){
                wx.showToast({
                    title: res.data.msg,
                })
                return
            }
            this.setData({
                task:res.data.data
            })
        })
    },
   
    onShareAppMessage: function() {
        /*title	转发标题	当前小程序名称
          path	转发路径	当前页面 path ，必须是以 / 开头的完整路径
          imageUrl	自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。	使用默认截图
        */
        // return {
        //     title:'',
        //     path:  分销端 用户端
        // }
    }
})