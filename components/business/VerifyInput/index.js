import React, { PropTypes } from 'react'
import { Input } from 'antd';

/**
 * 组件属性申明
 * @name 参数名
 * @form 表单，antd
 * @defaultRules 是否使用默认校验方式
 * @required 是否是必填项
 * @inputType 输入类型，默认为string
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    defaultRules: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    labelName: PropTypes.string,
    inputType: PropTypes.string 
}

/**
 * 校验input
 */
export default class VerifyInput extends React.Component {
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
                { ...other }
            />
        )
    }
    generateRules() {
        const { required, verifyRules, labelName, inputType } = this.props;
        let rules = [];
        if (required) {
            rules.push({ 
                required: true, 
                type: inputType || 'string',
                message: '请输入' + (labelName || '') 
            });
        }
        if (verifyRules) {
            rules.concat(verifyRules);
        }
        return rules;
    }
}
