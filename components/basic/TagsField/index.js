/**
 * @file 复合组件，Tag组件集，提供单选功能以响应更细节的信息，此组件重要的功能一是开发属性，
 *       对于Tag集可以提供方便的事件绑定，另一重要功能在于对单选功能的支持。
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 */
import React, { PropTypes } from 'react';
import Tag from '../Tag';

import './styles.less';

/**
 * 组件属性申明
 * 
 * @property {array} tags 包含的标签，格式示例：[{value: 1990, label: '李淳'}]
 * @property {func} onClickTag 点击标签事件【两个参数，第一个参数为value，第二个参数为是否选中bool】
 * @property {func} onCloseTag 关闭标签事件【一个参数，value】
 * @property {any} selected 选中的标签
 */
const propTypes = {
    tags: PropTypes.array.isRequired,
    onClickTag: PropTypes.func,
    onCloseTag: PropTypes.func,
    selected: PropTypes.any
}

/**
 * 主组件
 * 
 * @export
 * @class TagsField
 * @extends {React.Component}
 */
export default class TagsField extends React.Component {
	/**
	 * Creates an instance of TagsField.
	 * 
	 * @param {any} props
	 * 
	 * @memberOf TagsField
	 */
	constructor(props) {
		super(props);
	}

	render() {
        const { tags, onClickTag, onCloseTag, selected } = this.props;
		return  (
            <div className="tags-field">
                { tags.map(item => {
                    return (
                        <Tag
                            key = { item.value }
                            onClick = { onClickTag }
                            onClose = { onCloseTag }
                            value = { item.value }
                            selected = { item.value === selected }
                            >
                                { item.label }
                        </Tag>)
                })}
            </div>
        )
	}
}