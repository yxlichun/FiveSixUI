import moment from 'moment'
import { DATE_TYPE, DEFAULT_DATE_FORMAT } from './constant';

const Utils = {};

/**
 * 根据日期类型获取区间值
 * 
 * @param {string}         type               日期类型
 * 
 * @return {array} 日期区间值
 * 
 * @memberOf SearchPeriod
 */
Utils.getRangeValByType = (type) => {
    let p = [];

    switch (type) {
        case DATE_TYPE[1].name: // 昨天
            p.push(moment().subtract(1, 'days').startOf('day'));
            p.push(moment().subtract(1, 'days').endOf('day'));
            break;
        case DATE_TYPE[2].name: // 明天
            p.push(moment().add(1, 'days').startOf('day'));
            p.push(moment().add(1, 'days').endOf('day'));
            break;
        case DATE_TYPE[3].name: // 最近一周
            p.push(moment().subtract(7, 'days'));
            p.push(moment().subtract(1, 'days'));
            break;
        case DATE_TYPE[4].name: // 最近一月
            p.push(moment().subtract(30, 'days'));
            p.push(moment().subtract(1, 'days'));
            break;
        case DATE_TYPE[0].name: // 今天
        default:
            p.push(moment().startOf('day'));
            p.push(moment().endOf('day'));
            break;
    }

    return p;
}


/**
 * 格式化日期, pure
 * 
 * @param {array} val 区间日期数组
 * @param {array} format 日期格式
 * 
 * @return {array} 格式化后的日期数组
 * 
 * @memberOf SearchPeriod
 */
Utils.transferDate = (val, format = DEFAULT_DATE_FORMAT) => {
    let arr = [ ...val ];

    arr[0] = arr[0] ? moment(arr[0]).format(format) : '';
    arr[1] = arr[1] ? moment(arr[1]).format(format) : '';

    return arr;
}

export default Utils;
