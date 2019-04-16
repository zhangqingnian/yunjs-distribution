//index.js

import {
    config
} from '../../config.js';
import {IndexModel} from '../../models/index.js';
let indexModel = new IndexModel();
import { TeamModel } from '../../models/team.js';
let teamModel = new TeamModel();

//获取应用实例
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        isOn: false,
        isShow:false,
        search:false,
        isLoading: true,
        more:'',
        on: '/images/my/icon-on.png',
        off: '/images/my/icon-off.png',
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

        //校验城市 经纬度
        if (!this._checkCity()){
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
            return
        }
        
        

        var scene = options.scene;
        console.log(scene)
        // if(scene){
        //     scene = decodeURIComponent(options.scene)
        //     this.setData({ scene })
        //     if (!this._cheackLogin()){
        //         wx.showModal({
        //             title: '提示',
        //             content: '请重新授权登录',
        //             showCancel: false,
        //             confirmText: '确定',
        //             success() {
        //                 wx.navigateTo({
        //                     url: '/pages/authorize/index',
        //                 })
        //             }
        //         })
        //         return
        //     }
        //     this.setData({isShow:true})
        // } 

        this._getBanner()   //轮播
    },
    onShow() {
        let { nodecode, city } = wx.getStorageSync('city');
        this.setData({
            city,
            list:[]
        })
        this._getList({})   //列表
    },
    onReachBottom: function () {
        this.setData({
            more: Math.random()
        })
    },
    //搜索
    onSeacrhVenue(){
        this.setData({
            search:true
        })
    },
    onClose(){
        this.setData({
            search: false
        })
    },
    //勾选协议
    onSelect() {
        this.setData({
            isOn: !this.data.isOn
        })
    },
    //取消加入团队
    onCancel(){
        this.setData({
            isShow:false
        })
    },
    //确定加入团队
    onConfirm(){
        let isOn = this.data.isOn;
        if(!isOn){
            wx.showToast({
                title: '请先阅读协议并勾选!',
                icon:'none'
            })
            return
        }
        let teamCode = 'TEAM2019021968D3E00607A390B1';
        teamModel.joinTeam({
            teamCode
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,
                icon: 'none'
            })
            this.setData({
                isShow: false
            })
        })
    },
    //加载更多
    onLoadMore(){
        let total = this.data.total;
        let currentRecommendType = this.data.currentRecommendType;
        let start = this.data.list.length;
        if(start >= total)return;
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._getList({ currentRecommendType, start });
        }
        
        
    },
    //跳转任务列表
    onTaskList(e){
        let id = e.currentTarget.dataset.item.id;
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
        let { nodecode } = wx.getStorageSync('city');
        wx.showLoading();
        indexModel.getList({
            recommendType,     
            lat: latitude,
            lon: longitude,
            start,
            limit:10,
            searchCity: nodecode
        }).then(res => {
            wx.hideLoading();
            this.data.isLoading = true;
            console.log(res.data.items)
            var temArray = this.data.list.concat(res.data.items);
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
            return false;
        }
        return true;
    },
    _cheackLogin(){
        let token = wx.getStorageSync('token').accessToken;
        return token ? true : false;
    },


    
})