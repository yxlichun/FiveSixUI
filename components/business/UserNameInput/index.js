/**
 * @file 用户名输入校验组件 表单项-用户名
 *       modified by zhangcongfeng<zhangcongfeng@iwaimai.baidu.com>
 * 
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react'
import { Input } from 'antd';

/**
 * 组件属性申明
 * @name 参数名
 * @form 表单，antd
 * @defaultRules 是否使用默认校验方式
 * @required 是否是必填项
 * @disabled 是否禁用状态
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    defaultRules: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool
}

/**
 * 主组件
 * 
 * @export
 * @class UserName
 * @extends {React.Component}
 */
export default class UserName extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        const { name, form, initialValue} = this.props;
        const newValue = nextProps.initialValue;
        if (initialValue !== newValue) {
            form.resetFields([name]);
        }
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
                disabled = { !!disabled }
                { ...other } />
        )
    }
    /**
     * 添加必填项字段和默认校验方式
     * @memberOf UserName
     */
    generateRules() {
        const { required, defaultRules } = this.props;
        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入用户名' });
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
     * @memberOf UserName
     */
    regVerify(rule, value, callback) {
        /*
            1.不为空
            2.必须以 大小写字母或者数字 [a-z A-Z 0-9] 开头  
            3.开头后 可以加 [ a-z A-Z 0-9 _ @ . - ] 这些字符，后面这些字符 至少3个，最多63个 （也就是  4 =< 用户名长度 <= 64） 
            4.整个用户名 必须 至少包含 一个 大小写字母。
        */
        // 以上为从Pass拿到的校验规则，对其进行修改，以字母开头，不允许使用数字开头，剩余保持一致
        if (value && !/^[a-zA-Z]{1}[a-zA-Z0-9_@\.\-]{3,63}$/.test(value)) {
            callback('请输入正确用户名，字母开头，可包含字母数字下划线，长度为4-64');
        } else {
            callback();
        }
    }
}
