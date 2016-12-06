/**
* @file 发布表单姓名输入校验组件 表单项-姓名
*       modified by wangying02 <wangying02@iwaimai.baidu.com>
*
* @author lichun <lichun@iwaimai.baidu.com>
* @version 0.0.1
*
*/
import React, { PropTypes } from 'react'
import { Input } from 'antd';

/**
 * 组件属性申明
 *
 * @property {string} name 参数名
 * @property {object} form 表单，antd
 * @property {bool} defaultRules 是否使用默认校验方式
 * @property {bool} required 是否是必填项
 * @property {bool} disabled
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
 * @class ChineseName
 * @extends {React.Component}
 */

/**
 * 表单项--姓名
 */
export default class ChineseName extends React.Component {
    /**
     * Creates an instance of ChineseName.
     *
     * @param {any} props
     *
     * @memberOf ChineseName
     */
    constructor(props) {
        super(props);
    }
    render() {
        const { name, form, initialValue, disabled, ...other } = this.props;
        return  form.getFieldDecorator(name, {
                    initialValue,
                    rules: this.generateRules(),
                    ...other
                })(
            <Input
                size="large"
                name = { name }
                disabled = { disabled }
            />);
    }
    /**
     * 添加必填项字段和默认校验方式
     * @memberOf ChineseName
     */
    generateRules() {
        const { required, defaultRules } = this.props;
        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入姓名' });
        }
        if (defaultRules) {
            rules.push({ validator: this.regVerify })
        }
        return rules;
    }
    /**
     * 密码验证函数
     * @param {rule} 指定被验证的字段
     * @param {value} 输入的值
     * @param {callback} 验证完成执行回调
     * @memberOf ChineseName
     */
    regVerify(rule, value, callback) {
        if (value && !/^[\u4e00-\u9fa5]{1,20}$/.test(value)) {
            callback('姓名必须使用身份证姓名');
        } else {
            callback();
        }
    }
}
