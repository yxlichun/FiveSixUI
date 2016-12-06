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
 * 表单项--身份证
 */
export default class IdcardInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name, form, initialValue, disabled, ...other } = this.props;
        return form.getFieldDecorator(name, {
                    initialValue,
                    rules: this.generateRules(),
                    ...other
                })(
            <Input
                size="large"
                name = { name }
                disabled = { disabled }
            />
        )
    }
    generateRules() {
        const { required, defaultRules } = this.props;
        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入身份证号' });
        }
        if (defaultRules) {
            rules.push({ validator: this.regVerify })
        }
        return rules;
    }
    regVerify(rule, value, callback) {
        const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
        const arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码
        if (/^\d{17}\d|x$/i.test(value)) {
            let sum = 0, idx;
            for (let i = 0; i < value.length - 1; i++) {
                // 对前17位数字与权值乘积求和
                sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
            }
            // 计算模（固定算法）
            idx = sum % 11;
            // 检验第18为是否与校验码相等
            if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
                callback()
            } else {
                callback('请输入正确身份证号码');
            }
        }
        else {
            callback('请输入正确身份证号码');
        }
    }
}
