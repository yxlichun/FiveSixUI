/**
* @file 提示组件
* @author 谢天
* @version 0.0.1
*/
import React, {Component, PropTypes} from 'react';
import '../styles.less';
/**
 * 组件属性申明
 *
 * @property {bool} show
 * @property {(string|object)} text
 * @property {object} style
 */
const propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
};
/**
 * 展示组件
 * @export
 * @class Option
 * @extends {React.Component}
 */
class Option extends Component {
    constructor(props) {
        super(props);
        /**
         * 点击事件，返回对应value及text impure
         */
        this.handleClick = () => {
            this.props.onClick && this.props.onClick(
                {
                    value: this.props.value,
                    text: this.props.label
                }
            );
        };
        /**
         * 鼠标移入事件，返回对应的位置信息及text impure
         */
        this.handleMouseEnter = (e) => {
            if (e.target.clientWidth < e.target.scrollWidth) {
                this.props.onMouseEnter && this.props.onMouseEnter({
                    style: {
                        top: $(e.target).position().top + 33,
                        left: 150
                    },
                    text: this.props.label
                });
            }
        };
        /**
         * 鼠标移出事件，返回false
         */
        this.handleMouseLeave = (e) => {
            if (e.target.clientWidth < e.target.scrollWidth) {
                this.props.onMouseLeave && this.props.onMouseLeave(false);
            }
        };
    }
    render() {
        return <li
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className={'wl-select-dropdown-menu-item' + (this.props.disabled ? ' wl-select-dropdown-menu-item-disabled' : '') + (this.props.selected ? ' wl-select-dropdown-menu-item-selected' : '')}
          ref={
              c => {
                  this.option = c;
              }
          }
               >
            {this.props.label}
        </li>;
    }
}

Option.propTypes = propTypes;
Option.defaultProps = {
    disabled: false,
    selected: false
};

export default Option;
