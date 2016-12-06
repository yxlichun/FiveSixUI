/**
* @file Selected Options 展示组件
* @author 谢天
* @version 0.0.1
*/
import React, {Component, PropTypes} from 'react';
import '../styles.less';
/**
 * 组件属性申明
 *
 * @property {bool} disabled
 * @property {(string|object)} value
 * @property {(string|number)} width
 * @property {bool} open
 * @property {function} handleClear
 * @property {function} onClick
 */
const propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    disabled: PropTypes.bool,
    open: PropTypes.bool,
    handleClear: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onClick: PropTypes.func.isRequired
};
/**
 * 展示组件
 * @export
 * @class SelectInput
 * @extends {React.Component}
 */
class SelectInput extends Component {
    render() {
        return (
          <div
            className={'wl-select' + (this.props.disabled ? ' wl-select-disabled' : '') + (this.props.open && !this.props.disabled ? ' wl-select-open' : '')}
            style={{width: this.props.width}}
            onClick={this.props.onClick}
          >
            <div className='wl-select-selection wl-select-selection--single'>
              <div className="wl-select-selection__rendered">
                <div className="wl-select-selection-selected-value">
                    {this.props.value}
                </div>
              </div>
              <span className="wl-select-selection__clear" onClick={this.props.handleClear} style={{display: this.props.handleClear ? '' : 'none'}} />
              <span className="wl-select-arrow">
                <b />
              </span>
            </div>
          </div>
        );
    }
}

SelectInput.propTypes = propTypes;
SelectInput.defaultProps = {
};

export default SelectInput;
