/**
 * @file 基础组件，标签组件，别于antd的标签组件，增加了点击事件
 * @author lichun <lichun@iwaimai.baidu.com>
 * @version 0.0.1
 */
import React, { PropTypes } from 'react';
import './styles.less';

/**
 * 组件属性申明
 * 
 * @property {any} value 标签绑定的value值，必须
 * @property {func} onClick 点击标签事件【两个参数，第一个参数为value，第二个参数为是否选中bool】
 * @property {func} onClose 关闭标签事件【一个参数，value】
 * @property {bool} selected 是否是选中状态， default = false
 * @property {bool} closable 是否可关闭， default = true
 */
const propTypes = {
  value: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  selected: PropTypes.bool,
  closable: PropTypes.bool,
};

/**
 * 主组件
 * 
 * @export
 * @class Tag
 * @extends {React.Component}
 * 
 */
export default class Tag extends React.Component {
  /**
  * Creates an instance of Tag.
  * 
  * @param {any} props
  * 
  * @memberOf Tag
  */
  constructor(props) {
    super(props);
  }

  /**
   * 组件属性申明
   * 
   * @type {propTypes}
   * @memberOf Tag
   */
  propTypes: propTypes

  /**
   * 点击tag
   * 
   * @param {any} e
   * @param {any} value
   * 
   * @memberOf Tag
   */
  handlerClick(e, value) {
    e && e.stopPropagation();
    const { onClick, selected } = this.props;
    onClick && onClick(value, !selected);
  }
  /**
   * 关闭tag
   * 
   * @param {any} e
   * @param {any} value
   * 
   * @memberOf Tag
   */
  handlerClose(e, value) {
    e && e.stopPropagation();
    const { onClose } = this.props;
    onClose && onClose(value);
  }
  render() {
    const { value, selected, closable } = this.props;

    return (
      <div 
        data-value={value}
        className={selected ? 'wl-tag wl-tag-selected' : 'wl-tag'}
        onClick={e => this.handlerClick(e, value)}
      >
        <span className="wl-tag-text">
          {this.props.children}
        </span>
        {typeof closable === 'undefined' || closable === true ?  
          <span 
            className="wl-tag-close"
            onClick={e => this.handlerClose(e, value)} 
          /> : ''
        }
      </div>
    );
  }
}
