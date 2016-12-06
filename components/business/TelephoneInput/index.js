import React, { PropTypes } from 'react'
import { Input } from 'antd';

/**
 * 组件属性申明
 * @name 参数名
 * @form 表单，antd
 * @defaultRules 是否使用默认校验方式
 * @required 是否是必填项
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    defaultRules: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool
}

/**
 * 表单项--电话号码
 */
export default class TelephoneInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name, form, initialValue, disabled, defaultRules, ...other } = this.props;
        return form.getFieldDecorator(name, {
                    initialValue,
                    rules: this.generateRules(),
                    ...other
                })(
            <Input
                size="large"
                name = { name }
                disabled = { disabled }
                { ...other }
            />
        )
    }
    generateRules() {
        const { required, defaultRules } = this.props;
        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入手机号码' });
        }
        if (defaultRules) {
            rules.push({ validator: this.regVerify })
        }
        return rules;
    }
    regVerify(rule, value, callback) {
        if (value && !/^1[34578]{1}\d{9}$/.test(value)) {
            callback('请输入正确手机号码');
        } else {
            callback();
        }
    }
}
