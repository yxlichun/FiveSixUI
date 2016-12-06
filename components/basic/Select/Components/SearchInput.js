/**
* @file 带搜索按钮的输入框组件
* @author 谢天
* @version 0.0.1
*/
import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import '../styles.less';
/**
 * 组件属性申明
 *
 * @property {function} onChange
 * @property {string} value
 * @property {(string|number)} width
 */
const propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
/**
 * 展示组件
 * @export
 * @class SearchInput
 * @extends {React.Component}
 */
class SearchInput extends Component {
    constructor(props) {
        super(props);
        /**
         * @inner {bool} focus
         */
        this.state = {
            focus: false
        };
        /**
         * 点击事件，动画效果 impure
         */
        this.handleClick = () => {
            findDOMNode(this.button).className = findDOMNode(this.button).className.replace(' wl-myBtn-clicked', '');
            this.clickedTimeout = setTimeout(() => {
                return findDOMNode(this.button).className += ' wl-myBtn-clicked';
            }, 10);
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                findDOMNode(this.button).className = findDOMNode(this.button).className.replace(' wl-myBtn-clicked', '');
            }, 500);
        };
        /**
         * 兼容chrome impure
         */
        this.handleMouseUp = () => {
            findDOMNode(this.button).blur();
        };
        /**
         * 取得焦点 impure
         */
        this.handleFocus = () => {
            this.setState(
                {
                    focus: true
                }
            );
        };
        /**
         * 失去焦点 impure
         */
        this.handleBlur = () => {
            this.setState(
                {
                    focus: false
                }
            );
        };
    }
    render() {
        return (
          <div className="wl-search-input-wrapper" style={{marginTop: '1px', marginBottom: '2px', width: this.props.width }}>
            <span className="wl-input-group">
              <div className="wl-select">
                <div className={'wl-select-selection wl-select-selection--search' + (this.state.focus ? ' wl-select-selection-focus' : '')}>
                  <div className="wl-select-selection__rendered--search">
                    <div className="wl-select-selection__placeholder" style={{display: this.state.focus || this.props.value ? 'none' : ''}}>
                    {"search.."}
                    </div>
                    <ul style={{marginBottom: '0px'}}>
                      <li className="wl-select-search--inline">
                        <div className="wl-select-search__field__wrap">
                          <input className="wl-select-search__field" value={this.props.value} onChange={this.props.onChange} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
                          <span className="wl-select-search__field__mirror" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="wl-input-group-wrap">
                <button
                  ref={(c) => {
                      this.button = c;
                  }} type="button" onClick={this.handleClick} onMouseUp={this.handleMouseUp} className="wl-myBtn wl-search-btn"
                >
                  <i className="wl-icon wl-icon-search">
                  </i>
                </button>
              </div>
            </span>
          </div>
        );
    }
}

SearchInput.propTypes = propTypes;
SearchInput.defaultProps = {
};

export default SearchInput;
