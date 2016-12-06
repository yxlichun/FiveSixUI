/**
* @file 发布表单中文输入校验组件 表单项-校验中文输入框
*       modified by wangying02 <wangying02@iwaimai.baidu.com>
*
* @author lichun <lichun@iwaimai.baidu.com>
* @version 0.0.1
*
*/
import React, { PropTypes } from 'react';
import { Input } from 'antd';

import { createOptionsFromObj, createOptionsFormTwoLevel } from 'utils/utils';

/**
 * 组件属性申明
 *
 * @property {string} name 参数名
 * @property {object} form 表单，antd
 * @property {bool} defaultRules 是否使用默认校验方式
 * @property {bool} required 是否是必填项
 * @property {string} labelName 当required为true时，最好传递此字段完善提示
 * @property {bool} disabled 是否为只读
 * @property {number} maxLength 输入框的最大长度
 * @property {number} minLength 输入框的最小长度
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    defaultRules: PropTypes.bool,
    required: PropTypes.bool,
    labelName: PropTypes.string, // 当required为true时，最好传递此字段完善提示
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    minLength: PropTypes.number
}
/**
 * 主组件
 *
 * @export
 * @class ChineseVerifyInput
 * @extends {React.Component}
 */
const DEFAULT_MIN_LENGTH = 0;   //默认输入框最小长度
const DEFAULT_MAX_LENGTH = 50;  //默认输入框最大长度
/**
 * 表单项--校验中文输入框，如姓名、籍贯等
 */
export default class ChineseVerifyInput extends React.Component {
    /**
     * Creates an instance of ChineseVerifyInput.
     *
     * @param {any} props
     *
     * @memberOf ChineseVerifyInput
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
     * @memberOf ChineseVerifyInput
     */
    generateRules() {
        const { required, defaultRules, labelName } = this.props;


        let rules = [];
        if (required) {
            rules.push({ required: true, message: '请输入' + labelName });
        }
        if (defaultRules) {
            rules.push({ validator: (rule, value, callback) => this.regVerify(rule, value, callback) });
        }
        return rules;
    }
    /**
     * 密码验证函数
     * @param {rule} 指定被验证的字段
     * @param {value} 输入的值
     * @param {callback} 验证完成执行回调
     * @memberOf ChineseVerifyInput
     */
    regVerify(rule, value, callback) {
        const {  minLength, maxLength, labelName } = this.props;
        let min = minLength || DEFAULT_MIN_LENGTH;
        let max = maxLength || DEFAULT_MAX_LENGTH;

        if (value && !/^[\u4e00-\u9fa5]*$/.test(value)) {
            callback(labelName + '需输入中文');
        } else if (value.length > max || value.length < min) {
            callback(labelName + '长度为' + min + '-' + max);
        } else {
            callback();
        }
    }
}
