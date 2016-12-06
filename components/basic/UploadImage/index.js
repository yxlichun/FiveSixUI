/**
 * @file 复合组件，图片上传组件,暂时仅支持单个上传
 *       modified by lihuan<lihuan@iwaimai.baidu.com>
 * 
 * @author xietian <xietian@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react';
import { Modal, Upload, Button, Icon } from 'antd';

/**
 * 组件属性申明
 * @property {string} uploadService 上传的服务器地址，必须
 * @property {string} imgName 图片名，必须
 * @property {string} imgUrl 图片链接
 * @property {bool} showSize 
 * @property {function} onChange change事件
 * @property {bool} disabled 上传按钮是否可点击
 */
const propTypes = {
    uploadService: PropTypes.string.isRquired,
    imgName: PropTypes.string.isRquired,
    imgUrl: PropTypes.string,
    showSize: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
}

const MAX_WIDTH = 900;

/**
 * 主组件
 * 
 * @export
 * @class UploadImage
 * @extends {React.Component}
 */
export default class UploadImage extends React.Component {
    /**
     * Creates an instance of UploadImage.
     * 
     * @param {any} props
     * 
     * @memberOf UploadImage
     */
    constructor(props) {
        super(props);
        const { imgUrl, imgName } = props;
        this.state = {
            imgUrl,
            fileList: imgUrl ? [{
                uid: -1,
                name: imgName,
                status: 'done',
                url: imgUrl
            }] : [],
            priviewModal: false,
            modalWidth: MAX_WIDTH
        }
    }

    /**
     * 组件加载且dom树中添加img元素后，改变state
     * 
     * @memberOf UploadImage
     */
    componentDidMount() {
        const { showSize, imgUrl, imgName } = this.props;
        let me = this;
        if (showSize && imgUrl) {
            let file = { ...this.state.fileList[0] }
            $('<img src="' + imgUrl + '">').load(function () {
                file.name = imgName + ' ' + this.width + ' X ' + this.height;
                me.setState({
                    fileList: [file],
                    modalWidth: this.width + 50 > MAX_WIDTH ? MAX_WIDTH : this.width + 50
                })
            });
        }
    }

    /**
     * props更新时，当上传不同图片时，改变state
     * 
     * @param {any} nextProps
     * 
     * @memberOf UploadImage
     */
    componentWillReceiveProps(nextProps) {
        const { showSize, imgUrl, imgName } = this.props;
        if (imgUrl !== nextProps.imgUrl || imgName !== nextProps.imgName) {
            let me = this;
            if (showSize && nextProps.imgUrl) {
                let file = { ...this.state.fileList[0] }
                $('<img src="' + nextProps.imgUrl + '">').load(function () {
                    file.name = nextProps.imgName + ' ' + this.width + ' X ' + this.height;
                    file.url = nextProps.imgUrl;
                    me.setState({
                        fileList: [file],
                        modalWidth: this.width + 50 > MAX_WIDTH ? MAX_WIDTH : this.width + 50,
                        imgUrl: nextProps.imgUrl
                    });
                });
            }
        }
    }

    /**
     * 上传触发事件
     * 
     * @param {object} data 
     * 
     * @memberOf UploadImage
     */
    onUploadPicture(data) {
        const { onChange, showSize } = this.props;
        let fileList = data.fileList;
        fileList = fileList.slice(-1);
        if (data.file.response && data.file.response.data && data.file.status !== 'removed') { // success
            const url = data.file.response.data.url
            onChange && onChange(url);
            if (showSize && url) {
                let file = { ...fileList[0] };
                let me = this;
                $('<img src="' + url + '">').load(function () {
                    file.name = file.name + ' ' + this.width + ' X ' + this.height;
                    me.setState({
                        fileList: [file],
                        imgUrl: url,
                        modalWidth: this.width + 50 > MAX_WIDTH ? MAX_WIDTH : this.width + 50
                    });
                });
            } else {
                this.setState({
                    fileList,
                    imgUrl: url
                });
            }
        } else if (data.file.status === 'removed') { // removed
            if (!this.props.disabled) { // disabled
                onChange && onChange('');
                this.setState({
                    fileList,
                    imgUrl: ''
                });
            }
        } else {// updating || error
            this.setState({
                fileList
            });
        }
    }

    /**
     * 点击上传的预览图片，查看图片
     * 
     * @param {bool} show 是否显示预览modal
     * 
     * @memberOf UploadImage
     */
    showModal(show) {
        this.setState({
            priviewModal: show
        });
    }

    render() {
        const { uploadService, imgName, disabled } = this.props;
        const { fileList, imgUrl, priviewModal, modalWidth } = this.state;

        return (
            <div>
                <Upload
                    action={uploadService}
                    listType='picture'
                    onChange={(data) => this.onUploadPicture(data)}
                    fileList={fileList}
                    onPreview={() => this.showModal(true)}
                    >
                    <Button
                        type="ghost"
                        disabled={disabled}
                        >
                        <Icon type="upload" /> 点击上传
                    </Button>
                </Upload>
                <Modal
                    visible={priviewModal}
                    footer={null}
                    width={modalWidth}
                    onCancel={() => this.showModal(false)} >
                    <img alt={imgName} src={imgUrl} style={{ maxWidth: modalWidth - 50 }} />
                </Modal>
            </div>
        )
    }
}

