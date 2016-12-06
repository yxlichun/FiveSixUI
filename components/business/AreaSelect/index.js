import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import Utils from './utils';
import MultiSelect from 'comp/MultiSelect';
import SingleSelect from 'comp/SingleSelect';

import './styles.less';

/**
 * 组件属性申明
 * 此组件依赖于模板权限数据
 * 区域，商圈选择组件
 * @param { team: {}, city: {}...}
 * default config {
 *     show: false,
 *     showLabel: false,// 是否显示label
 *     multiple: false,
 *     value: NULL,// 为'all'时表示全选
 *     withAll: false,
 *     width: 150// 默认宽度是150
 * }
 * @type 可选，表示是正向级联（forward）还是反向级联（reverse），默认为正向级联
 */
const propTypes = {
    config: PropTypes.object.isRequired,
    type: PropTypes.string,
    data: PropTypes.object
};

const { ALL, NULL, getAreaValue, getAreaDataOptions } = Utils;
let types;

export default class AreaSelect extends React.Component {
    constructor(props) {
        super(props);
        const { config, type, data, isDefault } = this.props;
        types = Utils['types']['forward']
        if (type) {
            types = Utils['types'][type]
        }
        let areaValue = getAreaValue(config, type, data);
        const areaData = getAreaDataOptions(config, areaValue, type, data, isDefault);
        this.state = {
            areaData: areaData,
            areaValue: areaValue
        }
    }

   componentWillReceiveProps(nextProps) {
        const { config, type, onChange, data, isDefault } = nextProps;
        if (this.compareConfig(config, this.props.config) && type == this.props.type && this.compareData(data, this.props.data)) {
            return;
        }
        types = type ? Utils['types'][type] : Utils['types']['forward'];
        
        let areaValue = getAreaValue(config, type, data);
        const areaData = getAreaDataOptions(config, areaValue, type, data, isDefault);
        this.setState({
            areaData: areaData,
            areaValue: areaValue
        })
        onChange && onChange(areaValue);
	}
    componentWillUnmount() {
        // console.log('销毁了');
    }
    compareData(newData, oldData) {
        return JSON.stringify(newData) == JSON.stringify(oldData)
    }
    compareConfig(newConfig, oldConfig) {
        for(let key in newConfig) {
            if (newConfig[key] && oldConfig[key]) {
                if (newConfig[key]['show'] != oldConfig[key]['show']) return false;
                if (newConfig[key]['multiple'] != oldConfig[key]['multiple']) return false;
                if (newConfig[key]['withAll'] != oldConfig[key]['withAll']) return false;
                if (!this.compareValue(newConfig[key]['value'], oldConfig[key]['value'])){
                    return false;
                } 
            } else {
                return false;
            }
        }
        return true;
    }
    compareValue(newValue, oldValue) {
        if ($.isArray(newValue)) {
            newValue = newValue.join();
        }
        if ($.isArray(oldValue)) {
            oldValue = oldValue.join();
        }
        return newValue == oldValue;
    }
    componentDidMount() {
        
    }
    render() {
        const { config, onChange, disabled } = this.props;
        const { areaData } = this.state;
        types = types || Utils['types']['forward'];
        return  (
            <div className="areaSelect" ref="areaSelect">
            { types.map((item, index) => {
                if (config[item] && config[item]['show']) {
                    return (
                        config[item]['multiple'] ? (
                            <MultiSelect 
                                ref = { item } 
                                name = { item }
                                data = { areaData[item] }  
                                disabled = { config[item]['disabled'] || disabled }
                                includeSelectAllOption = { config[item]['multiple'] && config[item]['withAll'] }
                                enableFiltering={ true }
                                onChange = { e => onChange(this.areaSelectChange(e, item)) } 
                                label = { config[item]['showLabel'] ? Utils.typesMapping[item] : false }
                                width = { config[item]['width'] || 150 }
                                key = { item }
                            />
                        ) : (
                            <SingleSelect 
                                ref = { item } 
                                name = { item }
                                data = { areaData[item] } 
                                disabled = { config[item]['disabled'] || disabled }
                                includeSelectAllOption = { config[item]['multiple'] && config[item]['withAll'] }
                                enableFiltering={ true }
                                onChange = { e => onChange(this.areaSelectChange(e, item)) } 
                                label = { config[item]['showLabel'] ? Utils.typesMapping[item] : false }
                                width = { config[item]['width'] || 150 }
                                key = { item }
                            />
                        )
                    )
                }
            })}
            </div>
        )
    }
    setButtonText(options) {
        if (options.length === 0) {
            return '没有选择';
        }
        else if (options.length > 3) {
            return options.length + '个选择';
        }
        else {
            var labels = [];
            options.each(function() {
                if ($(this).attr('label') !== undefined) {
                    labels.push($(this).attr('label'));
                }
                else {
                    labels.push($(this).html());
                }
            });
            var text = labels.join(', ');
            
            return text;
        }
    }
    areaSelectChange(value, selectLevel) {
        const { config, type, data, isDefault } = this.props;
        const { areaValue } = this.state;
        const newValue = value;
        let newAreaValue = this.updateValues(areaValue, selectLevel, newValue);
        // const areaData = getAreaDataOptions(config, newAreaValue, type, selectLevel);
        const areaData = getAreaDataOptions(config, newAreaValue, type, data, isDefault);
        this.setState({
            areaData: areaData,
            areaValue: newAreaValue
		});
        return newAreaValue;
    }
    getMultiSelectValue(isMulti, oldValue, newValue) {
        if (isMulti) {
            let checked = true;
            let newValueArray = [];
            if ($.isArray(oldValue)) {
                newValueArray = oldValue.map((value) => {
                    if (value != newValue) {
                        return value;
                    } else {
                        checked = false;
                    }
                });
                if (checked) {
                    newValueArray.push(newValue);
                } else {//去空
                    for(var i = 0; i < newValueArray.length; i++){
                        if(newValueArray[i] == "" || typeof(newValueArray[i]) == "undefined") {
                            newValueArray.splice(i,1);
                            i = i - 1;
                        } 
                    }
                }
            } else if (oldValue == '') {
                newValueArray.push(newValue);
            } else if (oldValue == newValue) {
                newValueArray.push(NULL);
            } else {
                newValueArray.push(oldValue);
                newValueArray.push(newValue);
            }
            return newValueArray;
        } else {
            return newValue;
        }
    }
    updateValues(values, level, value) {
        let newAreaValue = { ...values }
        let child = false;
        types.map((item) => {
            if (child) {
                newAreaValue[item] = NULL;
            }
            if (item == level) {
                child = true;
                newAreaValue[item] = value;
            }
        });
        return newAreaValue;
    }
}
