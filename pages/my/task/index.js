// pages/my/task/index.js
import {
    config
} from '../../../config.js';
import { MyModel } from '../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        taskList:[],
        isLoading:true,
        type:'',
        nav:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    onShow(){
        this.setData({ taskList: [] })
        this._myTaskNum();
        this._myTask()
    },
    onNav(e) {
        let item = e.currentTarget.dataset.item;
        this.data.nav.forEach(e => {
            e.id == item.id ? e.isOn = true : e.isOn = false;
        })
        this.setData({
            type: item.type,
            nav: this.data.nav,
            taskList: []
        })
        this._myTask({type:item.type})
    },
    onyeji(e){
        let item = e.currentTarget.dataset.item;
        if (item.com == '主管任务'){
            wx.navigateTo({
                url: '/pages/team/myTeam/index?id=' + item.teamId,
            })
        } else if (item.com == '分销任务'){
            wx.navigateTo({
                url: '/pages/team/teamDetail/index?item='+JSON.stringify(item),
            })
        }
    },
    onReachBottom(){
        let total = this.data.total;
        let start = this.data.taskList.length;
        let type = this.data.type;
        if (start >= total) return;

        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._myTask({ start, type })
        }
    },
    _myTask({start = 0, limit = 10, type = ''} = {}){
        let { latitude, longitude} = wx.getStorageSync('currentLocation');
        wx.showLoading()
        myModel.myTask({
            type,
            lat: latitude,
            lon: longitude,
            start,
            limit
        }).then(res => {
            wx.hideLoading();
            this.data.isLoading = false;
            let temArr = this.data.taskList.concat(res.data.items);
            this.setData({
                taskList:temArr,
                total:res.data.total
            })
            console.log(res.data)
        })
    },
    _myTaskNum() {
        myModel.myTaskNum().then(res => {
            let reslut = res.data.data;
            console.log(res)
            let nav = [{ name: '全部(' + reslut.allCount + ')', type: '', isOn: true, id: 1 },
                { name: '主管任务(' + reslut.teamPackageCount + ')', type: 1, isOn: false, id: 2 },
                { name: '分销员任务(' + reslut.salePackageCount + ')', type: 0, isOn: false, id: 3 }]
            this.setData({
                nav
            })
        })
    },
})