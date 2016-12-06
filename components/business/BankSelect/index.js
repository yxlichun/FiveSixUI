/**
 * @file 银行选择组件
 *      modified by zhangmin01 <zhangmin01@iwaimai.baidu.com>
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 */

import React, {PropTypes} from 'react';
import {Select} from 'antd';
const Option = Select.Option;
import {BANK_OPTIONS} from './constant';
import _ from 'lodash'

/**
 * 组件属性申明
 * @property {object} form
 * @property {string} name 参数名
 * @property {bool} required 是否必填
 * @property {bool} disabled 是否只读
 * @property {func} getPopupContainer 菜单渲染父节点。默认渲染到 body上
 * @property {string} initialValue 初始值
 */

const propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    isSelectAllOptions: PropTypes.bool
};

/**
 * 表单项--银行
 * @class
 * @extends ReactComponent
 */
export default class BankSelect extends React.Component {
    constructor(props) {
        super(props)
    }

    propTypes: propTypes

    /**
     * 创建选择器的option pure
     *
     * @param {array} arr
     * @return {array} option
     */
    _createOptionsFromArray(arr) {
        let options = arr.map(item => (
            <Option value={item} key={item}>{item}</Option>
        ))
        return options;
    }

    /**
     * 默认验证规则 pure
     *
     * @param {array} arr
     * @return {array} option
     */
    _generateRules() {
        const {required} = this.props;
        let rules = [];
        if (required) {
            rules.push({required: true, message: '请选择银行'})
        }
        return rules;
    }

    _getOptions () {
        const {isSelectAllOptions} = this.props;
        let options = this._createOptionsFromArray(BANK_OPTIONS);
        if (isSelectAllOptions) {
            options.unshift(<Option value=""  key="all">全部</Option>);
        }
        return options;
    }

    render() {
        const {form, name, disabled} = this.props;
        const getPopupContainer = this.props.getPopupContainer || () => document.body;
        const otherProps = _.omit(this.props, [
            'form',
            'name',
            'required',
            'disabled'
        ]);
        return form.getFieldDecorator(name, {
            rules: this._generateRules()
        })(
            <Select
                disabled={disabled}
                getPopupContainer={getPopupContainer}
                {...otherProps}
            >
                {this._getOptions()}
            </Select>);
    }
}
