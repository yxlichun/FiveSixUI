/**
 * @file 用户密码输入校验组件 表单项-用户登录密码&骑士密码
 *       modified by zhangcongfeng<zhangcongfeng@iwaimai.baidu.com>
 * 
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react'
import { Input } from 'antd';
import { PASSWORD_MASK } from 'src/utils/constant';

/**
 * 组件属性申明
 * @name 参数名
 * @form 表单，antd
 * @defaultRules 是否使用默认校验方式
 * @required 是否是必填项
 * @disabled: 是否禁用状态
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    defaultRules: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    userNameField: PropTypes.string
}

/**
 * 主组件
 * 
 * @export
 * @class UserPassWord
 * @extends {React.Component}
 */
export default class UserPassWord extends React.Component {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        userNameField: 'user_name'
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
                onFocus = {(e) => {
                    let value = form.getFieldValue(name);
                    if (value === PASSWORD_MASK) {
                        form.setFieldsValue({ [name]: ''});
                    }
                }}/>
        )
    }
    /**
     * 添加必填项字段和默认校验方式
     * @memberOf UserPassWord
     */
    generateRules() {
        const { required, defaultRules } = this.props;
        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入密码' });
        }
        if (defaultRules) {
            rules.push({ validator: this.regVerify.bind(this) })
        }
        return rules;
    }
    /**
     * 密码验证函数
     * @param {rule} 指定被验证的字段
     * @param {value} 输入的值
     * @param {callback} 验证完成执行回调
     * @memberOf UserPassWord
     */
    regVerify(rule, value, callback) {
        const { userNameField, form } = this.props;  
        if (value && value === PASSWORD_MASK) {
            callback();
        } else if (value && !/^[a-zA-Z0-9_!@#$%\^\&\*\(\)\.]{6,32}$/.test(value)) {
            callback('密码长度6-32位，且只包含数字字母及_!@#$%^&*().');
        } else if (value && !/([a-zA-Z]+.*[0-9]+)|([0-9]+.*[a-zA-Z]+)/.test(value)) {
            callback('密码需同时包含数字和字母');
        } else if (value && userNameField && value.indexOf(form.getFieldValue(userNameField)) > -1) {
            callback('密码中不能包含用户名');
        } else {
            callback();
        }
    }
}
