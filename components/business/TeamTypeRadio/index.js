/**
* @file 物流方类别单选框组件，暂仅用于取值，不用于设值
*       modified by wangying02 <wangying02@iwaimai.baidu.com>
*
* @author lichun <lichun@iwaimai.baidu.com>
* @version 0.0.1
*
*/
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom'
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * 组件属性申明
 * @property {string} name 参数名
 * @property {object} form 表单 antd
 * @property {function} onChange
 */
const propTypes = {
    name: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func
}

/**
 * 主组件
 *
 * @export
 * @class TeamTypeRadio
 * @extends {React.Component}
 */
const TEAM_TYPES = [
    { label: '自定义', value: 0 },
    { label: '直营', value: 1 },
    { label: '渠道', value: 2 }
]
export default class TeamTypeRadio extends React.Component {
    /**
     * Creates an instance of TeamTypeRadio.
     *
     * @param {any} props
     *
     * @memberOf TeamTypeRadio
     */
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        const { onChange } = this.props;
        return (
            <RadioGroup
                defaultValue={'0'}
                onChange = { onChange }
            >
            { TEAM_TYPES.map((type, index) => (
                <RadioButton value={type.value} key={type.value}>{type.label}</RadioButton>
            ))}
            </RadioGroup>
        )
    }
}
