1 // components/search/index.js
import {
    config
} from '../../config.js';
import { IndexModel } from '../../models/index.js';
let indexModel = new IndexModel();
import { TeamModel } from '../../models/team.js';
let teamModel = new TeamModel();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        more: {
            type: Number,
            observer: '_loadMore'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
        list: [],
        packageName: '',
        isLoading: true
        
    },
    /**
     * 组件的方法列表
     */
    methods: {
        
        //跳转任务详情
        onTaskList(e) {
            let id = e.currentTarget.dataset.item.id;
            wx.navigateTo({
                url: '/pages/taskList/index?id=' + id,
            })

        },
        onCancel(e) {
            this.triggerEvent('close', {}, {})
        },
        onConfirm(e) {
            let packageName = e.detail.value.trim();
            if (!packageName)  return;
            this.setData({ packageName, list:[] })
            this._getList({ packageName })
        },
        onDelete() {
            this.setData({ packageName:'',list:[]})
        },
        _loadMore() {
            let total = this.data.total,
                start = this.data.list.length,
                packageName = this.data.packageName;
            if (!packageName || (start >= total)) return;
            if (this.data.isLoading) {
                this.data.isLoading = false;
                this._getList({ packageName, start });
            }
        },
        //列表
        _getList({ packageName, start = 0 }) {
            let { latitude, longitude } = wx.getStorageSync('currentLocation');
            let { nodecode } = wx.getStorageSync('city');
            wx.showLoading();
            indexModel.getList({
                packageName,
                lat: latitude,
                lon: longitude,
                start,
                limit: 10,
                searchCity: nodecode
            }).then(res => {
                wx.hideLoading();
                this.data.isLoading = true;
                var temArray = this.data.list.concat(res.data.items);
                this.setData({
                    list: temArray,
                    total: res.data.total
                })
            })
        },

    }
})