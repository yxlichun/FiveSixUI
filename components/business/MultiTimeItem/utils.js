const Utils = {};


/**
 *  组件校验方法,可以在组件调用的位置调用
 *  调用方法: MultiTimeItem.checkTimeData
 */
Utils.checkTimeData = (arr) => {
    let arrList = _.cloneDeep(arr);
    arrList.sort((first, last) => moment(first.start, 'HH:mm').valueOf() - moment(last.start, 'HH:mm').valueOf());  //首先按照开始时间对数组进行排序
    let arrData = _.flatMap(arrList,(ret) => [moment(ret.start, 'HH:mm').valueOf(), moment(ret.end, 'HH:mm').valueOf()]);
    return !_.some(arrData, (value, index) => arrData[index + 1] && value >= arrData[index + 1]);
};

/**
 *  获取时间总长度方法,返回结果为毫秒
 *  调用方法: MultiTimeItem.getTimeLength
 */

Utils.getTimeLength = (arr) => {
    let arrList = _.cloneDeep(arr);
    return _.sumBy(arrList,(o) => moment(o.end, 'HH:mm').valueOf() - moment(o.start, 'HH:mm').valueOf())
};

export default Utils;