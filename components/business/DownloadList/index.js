/**
 * @file 业务组件，异步下载列表展示组件
 *       modified by lihuan<lihuan@iwaimai.baidu.com>
 * 
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react';
import { Modal, Button, Spin } from 'antd';
import moment from 'moment';

import './styles.less';

/**
 * 组件属性申明
 * 
 * @property {array} data 下载列表中的记录
 * @property {bool} show 组件是否可见
 * @property {function} onCancel 组件不可见事件
 */
const propTypes = {
    data: PropTypes.array, 
    show: PropTypes.bool, 
    onCancel: PropTypes.func 
}
const statusMap = {
    0: ['going', '正在下载，请稍候…'],
    1: ['going', '正在下载，请稍候…'],
    2: ['finish', '完成'],
    3: ['error', '失败']
};

/**
 * 主组件
 * 
 * @export
 * @class DownloadList
 * @extends {React.Component}
 */
export default class DownloadList extends React.Component {
    /**
     * Creates an instance of DownloadList.
     * 
     * @param {any} props
     * 
     * @memberOf DownloadList
     */
	constructor(props) {
		super(props)
	}

    /**
     * 组件属性申明
     * 
     * @type {propTypes}
     * @memberOf DownloadList
     */
	propTypes: propTypes

	render() {
        const { data, show, onCancel } = this.props;

        return (
            <Modal 
                title = "下载列表" 
                visible = { show } 
                footer = { null } 
                className = "downloadList-modal" 
                width = { 800 }
                onCancel = { () => { onCancel && onCancel(false)} }
            >
                <ul>
                    { data.length > 0 ? data.map((item, index) => {
                        return (<li key={index} className={'downloadList-item-' + statusMap[item['status']][0]}>
                            <dl>
                                <dt>小度驿站-<span>{item.name}</span>&nbsp;【{moment.unix(item.create_time).format('YYYY-MM-DD HH:mm:ss')}】</dt>
                                <dd className="downloadList-status">
                                状态：{ statusMap[item['status']][1] }
                                </dd>
                                <dd className="downloadList-operate">
                                    { item.status == 2 ? <a href={item.download_url}>保存到本地</a> : (item.status == 3 ? <span /> : <Spin />)
                                    }
                                </dd>
                            </dl>
                        </li>)
                    }) : (
                        <div className="downloadList-no-download-record-panel">
                            您二十四小时内无下载记录
                        </div>
                    )}
                </ul>
            </Modal>
        )
	}
}