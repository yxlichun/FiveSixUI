/**
 * @file 面包屑组件, 对antd的面包屑组件进行了简单的封装
 *       modified by zhangcongfeng<zhangcongfeng@iwaimai.baidu.com>
 * 
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { Component, PropTypes} from 'react';
import { Breadcrumb } from 'antd';

/**
 * 组件属性申明
 * @property {array} config 面包屑数组(必要) [{title: '骑士管理'},{title: '装备管理'}]
 */
const propTypes = {
    config: PropTypes.array.isRequired
}

/**
 * 主组件
 * 
 * @export
 * @class Crumb
 * @extends {React.Component}
 */
export default class Crumb extends React.Component {
    /**
     * 获取Breadcrumb.Item数组
     * @param {config} 面包屑数组
     * @memberOf Crumb
     */
    getItems(config) {
        const items = [];
        const firstItem = config[0].title;
        firstItem.indexOf('当前位置') === -1 && (config[0].title = '当前位置：' + firstItem);
        config.map((item, index) => {
            items.push(
                <Breadcrumb.Item key = { index } >
                    { item.title }
                </Breadcrumb.Item>
            )
        });
        return items;
    }
    render() {
        const { config } = this.props;
        return (
            <div className="crumb">
                <Breadcrumb>
                { this.getItems(config) }
                </Breadcrumb>
            </div>
        );
    }
}