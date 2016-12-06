/**
 * @file 业务组件，异步下载按钮，触发异步下载特殊的弹框提醒
 *       modified by lihuan<lihuan@iwaimai.baidu.com>
 * 
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 */
import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';

/**
 * 组件属性申明
 * 
 * @property {func} downloadAction 关闭查看器组件事件【无参】
 */
const propTypes = {
    downloadAction: PropTypes.func
}
const confirm = Modal.confirm;

/**
 * 主组件
 * 
 * @export
 * @class AsynDownloadBtn
 * @extends {React.Component}
 * 
 */
export default class AsynDownloadBtn extends React.Component {
    /**
     * Creates an instance of AsynDownloadBtn.
     * 
     * @param {any} props
     * 
     * @memberOf AsynDownloadBtn
     */
	constructor(props) {
		super(props)
	}

    /**
     * 组件属性申明
     * 
     * @type {propTypes}
     * @memberOf AsynDownloadBtn
     */
	propTypes: propTypes

	render() {
        return (
            <Button 
                icon="download"
                style = { { marginTop: '3px' } } 
                onClick = { () => this.showDownloadConfirm() }
            >下载</Button>
        )
	}

    /**
     * 显示下载提示确定弹出框
     * 
     * @memberOf AsynDownloadBtn
     */
    showDownloadConfirm() {
        const { downloadAction } = this.props;
        confirm({
            title: '提示',
            content: '任务将被添加到异步下载列表，请不要一次下载超过40万条数据，确认？',
            onOk() {
                downloadAction && downloadAction();
            },
            onCancel() {},
        });
    }
}