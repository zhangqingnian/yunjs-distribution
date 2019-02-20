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
        //正常领取
        if (packageType == 1) {
            this._getTask({ packageId: this.data.id});
            
        }
        //指定领取
        if (packageType == 2){
            this.setData({
                show:true
            })
        }
        

    },
    onGodetail(e){
        let item = e.currentTarget.dataset.item;
        //type 1 馆卡  
        if(item.type == 1){
            wx.navigateTo({
                url: '/pages/venueCard/index',
            })
        }
        //type 2 课程
        if (item.type == 2) {
            wx.navigateTo({
                url: '/pages/venueCourse/index',
            })
        }
        console.log(item)
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
        // let obj = {};
        // if(typeof id == "number"){
        //     obj = {
        //         packageId:id
        //     }
        // }

        // if (typeof id == "string") {
        //     obj = {
        //         packageId: id,
        //         taskCode: taskCode
        //     }
        // }
        
        indexModel.getTask({
            packageId,
            taskCode
        }).then(res => {
            wx.showToast({
                title: res.data.msg
            })
            if (!res.data.success)return;
            this._getTaskList(this.data.id)
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