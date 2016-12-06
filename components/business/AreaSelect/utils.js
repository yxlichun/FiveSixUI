import { initDataAuth } from 'src/authController';

const Utils = {};

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

Utils.types = {};
Utils.types.forward = ['team', 'city', 'aoi', 'partner'];
Utils.types.reverse = ['team', 'city', 'partner', 'aoi'];

Utils.typesMapping = {
    'team': '物流方',
    'city': '城市',
    'aoi': '商圈',
    'partner': '合作方'
}
const ALL = Utils.ALL = '';
const NULL = Utils.NULL = '';

/**
 * 初始化区域选择值，多用于检索工具栏初始化首次检索值
 * @param areaConfig config值
 */
Utils.getInitAreaValue = (areaConfig, type = 'forward', data, isDefault) => {
    let areaValue = Utils.getAreaValue(areaConfig, type);
    Utils.getAreaDataOptions(areaConfig, areaValue, type, data, isDefault);
    return areaValue;
}

Utils.setInitAreaValue = (areaConfig, values, type = 'forward') => {
    let newAreaConfig = Utils.updateConfigValue(areaConfig, values);
    return Utils.getInitAreaValue(newAreaConfig, type);
}
/**
 * 根据传入values值更新config，此函数直接更新了props，待改进；
 * @param areaConfig 当前config
 * @param values 新值
 */
Utils.updateConfigValue = (areaConfig, values) => {
    let newAreaConfig = { ...areaConfig };
    for (let key in values) {
        if (newAreaConfig[key]) {
            newAreaConfig = {
                ...newAreaConfig,
                [key]: {
                    ...newAreaConfig[key],
                    value: values[key]
                }
            }
        }
    }
    return newAreaConfig;
}
/**
 * 收集当前areaselect组件的value
 * @param areaConfig 配置
 * @param type 级联顺序
 * @param data 新值传入
 */
Utils.getAreaValue = (areaConfig, type = 'forward', data) => {
    let areaValue = {};
    const types = Utils['types'][type];
    if (data) {
        areaValue['team'] = '';
        areaValue['city'] = '';
        areaValue['aoi'] = 'all';
        areaValue['partner'] = 'all';
        return areaValue;
    }
    for (let i = 0; i < types.length; i++) {
        let item = types[i];
        if(areaConfig[item]) {
            if (areaConfig[item]['show'] == false) {
                areaValue[item] = ALL;
            } else {
                areaValue[item] = areaConfig[item]['value']
            }
        } else {
            areaValue[item] = ALL;
        }
    }
    return areaValue;
}
Utils.getAreaDataOptions = (config, values, type = 'forward', data, isDefault) => {
    // 若传入data，表示此组件切换了物流方，重新对dataAuth进行计算
    let tempAuth = {};
    if (data) {
        tempAuth = initDataAuth(data);
    }
    // 默认使用模板提供的数据权限
    const dataAuth = tempAuth[type] || window._DATAAUTH_[type];
    const types = Utils['types'][type];
    let options = {};
    let tempOptions;
    
    if (!dataAuth) {
        return options;
    }
    const { auth, index } = dataAuth;
    for(let i = 0; i < types.length; i++) {
        let type = types[i];
        options[type] = [];
        if (config[type] && config[type]['show']) {
            if (!config[type]['multiple'] && config[type]['withAll']) {
                options[type].push({value: ALL, label: '全部'});
            }
            tempOptions = Utils.getOptions(type, auth, index, values, types);
            tempOptions.map((item) => {
                if ($.isArray(values[type])) {
                    let pos = values[type].findIndex((value) => {
                        return value == item.id
                    })
                    options[type].push({value: item.id, label: item.name, selected: pos == -1 ? false : true});
                } else if(values[type] === 'all') {
                    options[type].push({value: item.id, label: item.name, selected: true});
                } else {
                    options[type].push({value: item.id, label: item.name, selected: item.id == values[type] ? true : false});
                }
            })
            if ((values[type] == NULL ||  values[type] == undefined) && options[type].length > 0 && config[type]['multiple'] == false) {
                if (!isDefault) { // false的时候才是默认，哈哈哈哈
                    options[type][0]['selected'] = true;
                    values[type] = options[type][0]['value'];
                } else {
                    values[type] = '';
                }
            } else if (values[type] === 'all') {
                values[type] = tempOptions.map(item => {
                    return item.id;
                })
            }
        }
    }
    return options;
}
/**
 * 获得select下拉选框
 * @param type 哪一级别的选项
 * @param data 整体数据权限树
 * @param index 数据值寻址mapping
 * @param areaValue 选中值
 * @param types 级联关系序列数组
 */
Utils.getOptions = (type, data, index, areaValue, types) => {
    let options = [];
    let parentType = Utils.getParentType(type, types);
    let parentValue = areaValue[parentType];

    // 当父级为全部且父级不为第一级时，继续向上回溯
    while (parentValue === ALL && parentType != types[0]) {
        parentType = Utils.getParentType(parentType, types);
        parentValue = areaValue[parentType];
    }

    let obj = Utils.getChildArr(parentType, parentValue, data, index, type, types);
    let { childType, childArr } = obj;
    
    while (type !== childType) {
        let temptempArr = []
        childType = Utils.getChildType(childType, types);
        for (let i = 0; i < childArr.length; i++) {
            temptempArr = temptempArr.concat(childArr[i][childType]);
        }
        childArr = temptempArr.slice(0);
    }

    let tempObj = {};
    for (let i = 0; i < childArr.length; i++) {
        if (childArr[i] && childArr[i]['id'] && !tempObj[childArr[i]['id']]) {
            tempObj[childArr[i]['id']] = true;
            options.push(childArr[i]);
        }
    }
    return options;
}

Utils.getParentType = (type, types) => {
    const len = types.length;
    for (let i = len - 1; i >=0; i--) {
        if (types[i] === type) {
            if (i === 0) {
                return types[0];
            } else {
                return types[i - 1];
            }
        }
    }
    return type;
}
/**
 * 获得指定级别子级的array及类别
 * @param type 开始级别
 * @param value 开始级别对应的值
 * @param data 整体数据权限树
 * @param index 数据值寻址mapping
 * @param destType
 */
Utils.getChildArr = (type, value, data, index, destType, types) => {
    let childType, childArr = [], tempObj;
    if (type === types[0]) {
        // 首级
        childType = types[0];
        if (value == '' || destType == types[0]) {
            childArr = data[type];
        } else {
            if ($.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    tempObj = Utils.getObjByIndex(type, value[i], data, index, types);
                    childArr.push(tempObj)
                }
            } else {
                tempObj = Utils.getObjByIndex(type, value, data, index, types);
                childArr.push(tempObj);
            }
        }
    } else {
        childType = Utils.getChildType(type, types);
        if ($.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                tempObj = Utils.getObjByIndex(type, value[i], data, index, types);
                childArr = childArr.concat(typeof tempObj[childType] !== 'undefined' ? tempObj[childType] : []);
            }
        } else {
            tempObj = Utils.getObjByIndex(type, value, data, index, types);
            childArr = typeof tempObj[childType] !== 'undefined' ? tempObj[childType] : [];
        }
    }
    return {
        childArr,
        childType
    };
}
Utils.getChildType = (type, types) => {
    const len = types.length;
    for (let i = 0; i < len; i++) {
        if (types[i] === type) {
            if (i === len - 1) {
                return types[len - 1];
            } else {
                return types[i + 1];
            }
        }
    }
    return type;
}
/**
 * 获得指定type级别value值对应的子级结构
 * @param type
 * @param value
 * @param data 整体数据权限树
 * @param index 数据值寻址mapping
 */
Utils.getObjByIndex = (type, value, data, index, types) => {
    if (!type || !value) {
        return {};
    }
    const indexArr = typeof index[type] !== 'undefined' && typeof index[type][value] !== 'undefined' ? index[type][value].toString().split(',') : [];
    let tempData = { ...data };
    for (var i = 0; i < indexArr.length; i++) {
        tempData = tempData[types[i]][parseInt(indexArr[i])];
    }
    return tempData;
}

export default Utils;
