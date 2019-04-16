import {
    Http
} from '../utils/http.js';

export class MyModel extends Http {

    //小程序用户账户信息
    getBaseInfo(data) {
        return this.request({
            url: 'm/mini/saleUser/getMinePageDetail',
            data,
            method: 'POST'
        })
    }

    //获取我的基本信息
    getCustomerInfo(data) {
        return this.request({
            url: 'm/crm/customer/getCustomerInfo',
            data,
            method: 'POST'
        })
    }
    
    //修改我的基本信息
    updateCustomerInfo(data) {
        return this.request({
            url: 'm/crm/customer/updateCustomerInfo',
            data,
            method: 'POST'
        })
    }

    //获取订单
    orderList(data){
        return this.request({
            url: 'm/mini/venueGoodsOrder/pageVenueGoodOrderForMe',
            data,
            method: 'POST'
        })
    }

    //获取订单详情
    orderDetail(data) {
        return this.request({
            url: 'm/mini/venueGoodsOrder/getVenueGoodsOrderDetail',
            data,
            method: 'POST'
        })
    }

    //我的任务
    myTask(data) {
        return this.request({
            url: '/m/mini/commodityPackage/pageMyCommodityPackage',
            data,
            method: 'POST'
        })
    }

    //我的任务数量
    myTaskNum(data) {
        return this.request({
            url: 'm/mini/commodityPackage/getMyCommodityPackageCount',
            data,
            method: 'POST'
        })
    }

    //提现信息
    cashInfo(data) {
        return this.request({
            url: 'm/sys/taxCash/getCashWithdrawalDetail',
            data,
            method: 'POST'
        })
    }

    //提现
    cash(data) {
        return this.request({
            url: 'm/sys/taxCash/applicationForCashWithdrawal',
            data,
            method: 'POST'
        })
    }

    //提现纳税额
    cashTax(data) {
        return this.request({
            url: 'm/sys/tax/getTax',
            data,
            method: 'POST'
        })
    }

    //提现记录
    cashRecord(data){
        return this.request({
            url: 'm/sys/taxCash/myTaxCash',
            data,
            method: 'POST'
        })
    }

    //分销端获取团队二维码
    code(data) {
        return this.request({
            url: 'm/wxaCode/getTeamCode',
            data,
            method: 'POST'
        })
    }

    //获取银行卡
    getBank(data) {
        return this.request({
            url: 'm/sys/taxBank/pageMyBank',
            data,
            method: 'POST'
        })
    }
    //默认银行卡
    defaultBank(data) {
        return this.request({
            url: 'm/sys/taxBank/choiceDefaultBank',
            data,
            method: 'POST'
        })
    }

    //添加银行卡
    addBank(data) {
        return this.request({
            url: 'm/sys/taxBank/saveTaxBank',
            data,
            method: 'POST'
        })
    }
    

    //修改银行卡
    updateBank(data) {
        return this.request({
            url: 'm/sys/taxBank/updateTaxBank',
            data,
            method: 'POST'
        })
    }

    //删除银行卡
    removeBank(data) {
        return this.request({
            url: 'm/sys/taxBank/removeTaxBank',
            data,
            method: 'POST'
        })
    }
}