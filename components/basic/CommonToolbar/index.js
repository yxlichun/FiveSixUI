import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom'
import { Form } from 'antd';

import './styles.less';

const propTypes = {
}
/**
 * 公共工具栏组件，主要用于样式统一
 */
export default class CommonToolbar extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            fold: false,
            searchConditions: ''
        } 
	}

	propTypes: propTypes
    componentDidMount() {
        this.$content = $(findDOMNode(this.refs['toolbarContent']));

        
    }
    foldToolbar(event) {
        const { fold } = this.state;
        let searchConditions = '';
        if (fold) {
            this.$content.show(200);
        } else {
            this.$content.hide(200);
            searchConditions = this.getSearchConditions();
            if (searchConditions.length > 80) {
                searchConditions = searchConditions.substring(0, 80) + '...';
            }
        }
        $(window).trigger('resize.table');
        this.setState({
            fold: !this.state.fold,
            searchConditions
        })
    }
    getSearchConditions() {
        let items = this.$content.find('.ant-form-item');
        let searchConditions = {};
        let searchStr = '检索条件 >';
        for (let i = 0; i < items.length; i++) {
            let key = $(items[i]).find('label').html();
            if (key.indexOf('<') > -1) continue;
            let valueNode, value = '';
            // 此处使用的DOM方法来获取，非常不好，待改进
            // 多选框
            valueNode = $(items[i]).find('.ant-select-selection__choice__content');
            if (valueNode && valueNode.length > 0) {
                for (let j = 0; j < valueNode.length; j++) {
                    value += valueNode[j].innerHTML + (j == valueNode.length -1 ? '' : '，');
                }
                if (value) searchConditions[key] = value;
                continue;
            }

            valueNode = $(items[i]).find('span.ant-radio-button-checked');
            if (valueNode && valueNode.length > 0) {
                value = $(valueNode).next('span')[0].innerHTML;

                let nextNode = $(items[i]).find('.ant-input-wrapper input');
                if (nextNode && nextNode.length > 0) {
                    value += '，' + nextNode[0].value;
                }
                if (value) searchConditions[key] = value;
                continue;
            }

            valueNode = $(items[i]).find('span.ant-checkbox-checked');
            if (valueNode && valueNode.length > 0) {
                for (let j = 0; j < valueNode.length; j++) {
                    value += $(valueNode[j]).next('span')[0].innerHTML + (j == valueNode.length -1 ? '' : '，');
                }
                if (value) searchConditions[key] = value;
                continue;
            }

            valueNode = $(items[i]).find('.ant-calendar-range-picker-input');
            if (valueNode && valueNode.length > 0) {
                for (let j = 0; j < valueNode.length; j++) {
                    value += valueNode[j].value + (j == valueNode.length -1 ? '' : '，');
                }
                if (value) searchConditions[key] = value;
                continue;
            }

            valueNode = $(items[i]).find('.ant-select-selection-selected-value');
            if (valueNode && valueNode.length > 0) {
                for (let j = 0; j < valueNode.length; j++) {
                    value += valueNode[j].innerHTML + (j == valueNode.length -1 ? '' : '，');
                }
                if (value) searchConditions[key] = value;
                continue;
            }

            valueNode = $(items[i]).find('input');
            if (valueNode && valueNode.length > 0) {
                value = valueNode.val();
                if (value) searchConditions[key] = value;
                continue;
            } 
        }
        for (let label in searchConditions) {
            searchStr += ( ' 【' + label + '：' + searchConditions[label] + '】' );
        }
        return searchStr;
    }
	render() {
        const { showFoldBtn } = this.props;
        const { fold, searchConditions } = this.state;
        return (
            <div 
                className="section-con toolbar-con common-m"
                style={{background: fold ? '#ffffcc' : '#fff'}}
            >
                <div ref="toolbarContent">
                    { this.props.children }
                </div>
                <div 
                    className="general-search-condition"
                    onClick = { event => this.foldToolbar(event) }>
                    { searchConditions }
                </div>
                { showFoldBtn === false ? null :(
                    <div 
                        className = "fold-toolbar" 
                        onClick = { event => this.foldToolbar(event) }
                    >{fold ? '展 开' : '收 起'}</div>
                )}
            </div>
        )
	}
}