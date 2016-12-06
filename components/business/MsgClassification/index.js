import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom'
import { Cascader } from 'antd';

/**
 * 组件属性申明
 * @name 参数名
 */
const propTypes = {
}

/**
 * 发布分类级联选框
 */
export default class MsgClassification extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps) {
    }
    getOptions() {
        const { optionsData, config } = this.props;

        let options = optionsData || window._INITDATA_.msgClassification;
        let newOptions = this.updateOptions(options, 0);
        return newOptions;
    }
    updateOptions(data, level) {
        const { config } = this.props;

        let options = [];
        let withAll = config['withAll' + level];
        if (withAll) {
            options.push({
                value: '',
                label: '全部'
            });
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                let option = {};
                option.value = level + '-' + data[i]['id'];
                option.label = data[i]['name'];
                option.disabled = !data[i]['enable'];
                if (data[i]['children'] && data[i]['children'].length > 0) {
                    option.children = this.updateOptions(data[i]['children'], level + 1);
                }
                options.push(option);
            }
        }
        return options;
    }
    render() {
        const { disabled, value, onChange } = this.props;
        let options = this.getOptions();
        let defaultValue = this.formatValue(value);
        return (
            <Cascader
                size = "large"
                disabled = { disabled }
                options = { options } 
                onChange = { values => onChange(this.onChangeSelect(values)) }
                value = { defaultValue }
            />
        )
    }
    formatValue(values) {
        let newValues = [];

        if (values && $.isArray(values)) {
            for (let i = 0; i < values.length; i++) {
                newValues.push(i + '-' + values[i]);
            }
        }
        return newValues;
    }
    onChangeSelect(values) {
        let newValues = [];
        
        if (values && $.isArray(values)) {
            for (let i = 0; i < values.length; i++) {
                let tempArr = values[i].split('-');
                if (tempArr[1]) {
                    newValues.push(tempArr[1]);
                } else {
                    newValues.push('');
                }
            }
        }
        return newValues;
    }
}
