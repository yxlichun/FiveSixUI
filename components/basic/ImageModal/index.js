/**
 * @file 复合组件，图片查看器，可放大、缩小、顺时针和逆时针旋转
 *       modified by lichun<lichun@iwaimai.baidu.com> 修改为使用包裹子元素的方式，修改旋转主体；
 * @author lihuan <lihuan@iwaimai.baidu.com>
 * @version 0.0.1
 */
import React, { PropTypes } from 'react';
import { Modal, Button, Checkbox, message } from 'antd';
import './styles.less';

const ButtonGroup = Button.Group;

/**
 * 组件属性申明
 * 
 * @property {string} src 图片跳转链接
 * @property {bool} show 是否显示组件， default = false
 * @property {func} onClose 关闭查看器组件事件【无参】
 */
const propTypes = {
    src: PropTypes.string,
    show: PropTypes.bool,
    onClose: PropTypes.func
};
const DEFAULT_WIDTH = 300;
const MAX_WIDTH = 1000;

/**
 * 主组件
 * 
 * @export
 * @class ImageModal
 * @extends {React.Component}
 * 
 */
export default class ImageModal extends React.Component {
    /**
     * Creates an instance of ImageModal.
     * 
     * @param {any} props
     * 
     * @memberOf ImageModal
     */
    constructor(props) {
        super(props);
        this.state = {
            width: DEFAULT_WIDTH,
            deg: 0
        }
    }

    /**
     * 组件接收到新的 props 时调用，恢复state初始值
     * 
     * @param {any} nextProps 接收到的新的props
     * 
     * @memberOf ImageModal
     */
    componentWillReceiveProps(nextProps){
        if(!nextProps.show && this.props.show){
            this.setState({
                width: DEFAULT_WIDTH,
                deg: 0
            })
        }
    }

    /**
     * 组件属性申明
     * 
     * @type {propTypes}
     * @memberOf ImageModal
     */
    propTypes: propTypes

    /**
     * 缩小图片
     * 
     * @memberOf ImageModal
     */
    zoominImg() {
        const { width, deg } = this.state;
        if (width <= DEFAULT_WIDTH) {
            return;
        } else {
            this.setState({
                width: width * 0.8
            });
        }
    }

    /**
     * 放大图片
     * 
     * @memberOf ImageModal
     */
    zoomoutImg() {
        const { width, deg } = this.state;
        if (width >= MAX_WIDTH) {
            return;
        } else {
            this.setState({
                width: width * 1.2
            });
        }
    }

    /**
     * 逆时针旋转图片
     * 
     * @memberOf ImageModal
     */
    counterclockImg() {
        const { width, deg } = this.state;
        this.setState({
            deg: (deg - 90 + 360) % 360
        })
    }

    /**
     * 顺时针旋转图片
     * 
     * @memberOf ImageModal
     */
    clockwiseImg() {
        const { width, deg } = this.state;
        this.setState({
            deg: (deg + 90) % 360
        })
    }

    handleClose(onClose) {
        this.setState({
            show: true
        })
        onClose && onClose();
    }

    handleOpen(onOpen) {
        this.setState({
            show: false
        })
        onOpen && onOpen();
    }

    render() {
        const { show, width, deg } = this.state;
        const { src, onOpen, onClose } = this.props;

        return  (
            <div className="wl-imagemodal-wrapper">
                <div
                    onClick = {() => this.handleOpen(onOpen)}
                >
                    { this.props.children }
                </div>
                { show ? (
                    <Modal visible={ show || false } onCancel={ () => this.handleClose(onClose) }
                        wrapClassName="wl-imagemodal-show"
                        footer={ null }
                        width={ width+32 }
                    >
                        
                        <div className="wl-imagemodal-divImg" style={ { width } }>
                            <img 
                                src={ src } 
                                style={{
                                    width: width,
                                    transform: 'rotate('+deg+'deg)'
                                }}
                            />
                        </div>
                    </Modal>
                ) : ''}
                { show ? (
                    <div style={{ position: 'fixed', left: 100, top: 70, zIndex: 9999}}>
                        <ButtonGroup style={{left: '50%', marginLeft: -110}}>
                            <Button className="wl-imagemodal-btnOperate" onClick={ () => this.zoominImg() } >缩小</Button>
                            <Button className="wl-imagemodal-btnOperate" onClick={ () => this.zoomoutImg() } >放大</Button>
                            <Button className="wl-imagemodal-btnOperate" onClick={ () => this.counterclockImg() } >逆时针</Button>
                            <Button className="wl-imagemodal-btnOperate" onClick={ () => this.clockwiseImg()} >顺时针</Button>
                        </ButtonGroup>
                    </div>
                ) : ''}
            </div>
        )
    }
}
