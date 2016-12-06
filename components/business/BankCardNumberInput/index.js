/**
 * @file 银行卡输入校验组件
 *      modified by zhangmin01 <zhangmin01@iwaimai.baidu.com>
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 */
import React, {PropTypes} from 'react';
import {Input} from 'antd';
import _ from 'lodash';

/**
 * 组件属性申明
 * @property {object} form
 * @property {string} name 参数名
 * @property {bool} required 是否必填
 * @property {bool} disabled 是否只读
 * @property {string} initialValue 初始值
 * @property {func} validator 验证方法
 */

const propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    initialValue: PropTypes.any,
    validator: PropTypes.func
};

/**
 * 表单项 - 银行卡号
 *
 *
 * @class BankCardNumberInput
 * @extends ReactComponent
 */

export default class BankCardNumberInput extends React.Component {
    constructor(props) {
        super(props);
    }

    propTypes: propTypes

    /**
     * 默认验证方式
     *
     */

    _defaultVerify(rule, value, callback) {
        if(value && !/^(\d{4}\s?){4}(\d{3})?$/.test(value)) {
            callback('请输入正确的银行卡号');
        }
        else {
            callback();
        }
    }

    _generateRules() {
        const rules = [];
        const {required, validator} = this.props;
        if (required) {
            rules.push({
                required: true, message: '请输入银行卡号'
            });
        }
        if (!validator) {
            rules.push({
                validator: this._defaultVerify
            });
        }
        else {
            rules.push({
                validator: validator()
            });
        }
        return rules;
    }

    render() {
        const {form, name, disabled, initialValue} = this.props;
        const otherProps = _.omit(this.props, [
            'form',
            'name',
            'required',
            'disabled',
            'initialValue',
            'validator'
        ]);

        return form.getFieldDecorator(name, {
            initialValue,
            rules: this._generateRules()
        })(<Input
            disabled={disabled}
            {...otherProps}/>)
    }
}
