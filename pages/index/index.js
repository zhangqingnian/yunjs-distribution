//index.js

import {
    config
} from '../../config.js';
import {IndexModel} from '../../models/index.js';
let indexModel = new IndexModel();

//获取应用实例
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        city: '上海市',
        list:[],
        total:0,
        currentRecommendType: 1,  //1-任务推荐 2-高佣推荐 3-热销推荐       
        banner:[],         //轮播
        typeList: [
            { typeName: '任务推荐', recommendType: 1, isOn:true},
            { typeName: '高佣推荐', recommendType: 2, isOn: false },
            { typeName: '热销推荐', recommendType: 3, isOn: false }
            ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._checkCity();  //校验城市 经纬度
        this._getBanner()   //轮播
        this._getList({})   //列表
    },
    onShow() {
        let { nodecode, city } = wx.getStorageSync('city');
        this.setData({
            city
        })
    },
    //加载更多
    onLoadMore(){
        let total = this.data.total;
        let currentRecommendType = this.data.currentRecommendType;
        let start = this.data.list.length;
        if(start >= total)return;
        this._getList(currentRecommendType, start);
        
    },
    //跳转任务列表
    onTaskList(e){
        let id = e.currentTarget.dataset.item.id;
        console.log(id)
        wx.navigateTo({
            url: '/pages/taskList/index?id='+id,
        })

    },
    //选择类型 1-任务推荐 2-高佣推荐 3-热销推荐       
    onSelectType(e){
        let { typeName, recommendType} = e.currentTarget.dataset.item;
        let { typeList }= this.data;
        typeList.forEach(item => {
            if(item.typeName == typeName){
                item.isOn = true;
            }else{
                item.isOn = false
            }
        })
        
        this.setData({
            currentRecommendType: recommendType,
            typeList,
            list:[]  //情况
        })
        
        this._getList({recommendType})
    },
    //选择城市
    onSelectCity() {
        wx.navigateTo({
            url: '/pages/cityList/index',
        })
    },
    //webview
    goWebview(e) {
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/webviwe/index?item=' + JSON.stringify(item)
        })
    },
    //轮播
    _getBanner(){
        indexModel.getBannerAndActivity({
            activityType:1,
            programType:2
        }).then(res => {
            this.setData({
                banner:res.data.items || []
            })
        })
    },
    //活动
    _getActivity() {
        indexModel.getBannerAndActivity({
            activityType: 2,
            programType: 2
        }).then(res => {
            console.log(res);
        })
    },
    //列表
    _getList({recommendType = 1, start = 0}){
        let { latitude, longitude } = wx.getStorageSync('currentLocation');
        wx.showLoading();
        indexModel.getList({
            recommendType,     
            lat: latitude,
            lon: longitude,
            start,
            limit:10
        }).then(res => {
            wx.hideLoading();
            console.log(res.data.items)
            var temArray = res.data.items.concat(this.data.list);
            this.setData({
                list:temArray,
                total:res.data.total
            })
        })
    },
    //验证城市 名称经纬度
    _checkCity(){
        let { nodecode, city } = wx.getStorageSync('city');
        let { latitude, longitude } = wx.getStorageSync('currentLocation');
        if (!nodecode && !latitude) {
            wx.showModal({
                title: '提示',
                content: '请重新授权位置信息',
                showCancel: false,
                success: () => {
                    wx.navigateTo({
                        url: '/pages/authorizeLocation/index',
                    })
                }
            })
            return;
        }
    }


    
})