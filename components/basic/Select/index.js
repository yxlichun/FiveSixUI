/**
* @file Select
* @author 谢天
* @version 0.0.1
* @todo 兼容value类型
*       更合理的异常捕获
*       函数提纯
*/
import React, {Component, PropTypes} from 'react';
import {DropdownMenu, OptGroup, Option, SearchInput, SelectInput, Tips} from './Components';
import _ from 'lodash';
import {findDOMNode} from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
/**
 * 组件属性申明
 *
 * @property {bool} disabled
 * @property {(string|number)} width
 * @property {bool} multiple
 * @property {array} data          - example
 *                                           [                                 [
 *                                              {                                 {
 *                                                  value: 'lanye',                   text: '岚烨',
 *                                                  text: '岚烨'                      children: [
 *                                              }, ...                                             {
 *                                           ]                                                         value: 'lanye1',
 *                                                                                                     text: '岚烨1'
 *                                                                                                 }, ...
 *                                                                                              ]
 *                                                                                 }, ...
 *                                                                             ]
 * @property {string, array} value - 可控模式，必须提供，单选时是string，复选是array
 *                                 - 字面量 有时候，data源自后端，value初始化成为问题，因而提供了以下几个字面量：
 *                                   - @param {string} ALL
 *                                   - @return {(string|array)} 先返回'ALL'，然后返回全部value
 *                                   - @param {string} FIRST
 *                                   - @return {(string|array)} 先返回'FIRST'，然后返回第一个value
 *                                   - @param {string} LAST
 *                                   - @return {(string|array)} 先返回'LAST'， 然后返回最后一个value
 *                                   - @param {string} ANY
 *                                   - @return {(string|array)} 先返回'ANY'，然后返回任意一个value
 *                                   - @param {string} ANTIALL
 *                                   - @return {(string|array)} 返回'ANTIALL' 仅全选会被勾选，不同于ALL，该字面量是为了有些情况下，初始化想要全选，但是value值为空
 *                                 - 字面量会引起组件的re-render，字面量依然会在第一次被父组件获取到，因此，一定要加以判断
 *                                 - 字面量是反模式，尽量不要使用
 * @property {function} onChange - 可控模式，必须提供，返回用户操作带来的value变化，是否允许该变化由父组件决定
 * @deprecated {string, array} defaultValue - 不再提供defaultValue，直接设置value，不影响antd form 提供的initialValue
 * @property {bool} showSearch
 * @property {bool} showAll
 * @property {bool} allowClear
 * @property {object} style
 */
const propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    showSearch: PropTypes.bool,
    showAll: PropTypes.bool,
    allowClear: PropTypes.bool,
    style: PropTypes.object
};
/**
 * 主组件
 * @export
 * @class Select
 * @extends {React.Component}
 */
class Select extends Component {
    constructor(props) {
        super(props);
        /**
         * @inner {bool} openMenu
         * @inner {string} search
         * @inner {object} tipsStyle
         * @inner {string} tipsText
         * @inner {bool} tipsShow
         */
        this.state = {
            openMenu: false,
            search: '',
            tipsStyle: {
                display: 'none'
            },
            tipsText: '',
            tipsShow: false
        };
        /**
         * 菜单开关闭事件，最理想的实现应该是焦点事件，但是由于有SearchInput，故使用了jquery impure
         */
        this.handleOpenMenu = () => {
            if (this.state.openMenu) {
                $(document.body).off('click.multiselect');
            } else {
                $(document.body).on('click.multiselect', e => this.handleBlur(e));
            }
            this.setState(
                {
                    openMenu: !this.state.openMenu
                }
            );
        };
        /**
         * 失去焦点事件，关闭菜单，使用了jquery impure
         */
        this.handleBlur = (e) => {
            let $current = $(e.target);
            if ($current.closest($(findDOMNode(this))).length <= 0) {
                $(document.body).off('click.multiselect');
                this.setState({
                    openMenu: false
                });
            }
        };
        /**
         * 点击事件，返回此次点击带来的value变化 impure
         */
        this.handleClick = (e) => {
            if (this.props.multiple) {
                let ret = [];
                if (e.value !== 'ALL') {
                    if (_.includes(this.props.value, e.value)) {
                        ret = _.pull(_.clone(this.props.value), e.value);
                    } else {
                        ret = _.clone(this.props.value === 'ANTIALL' ? [] : this.props.value);
                        ret.push(e.value);
                    }
                } else {
                    ret = this.getAllValue(this.props.data);
                    if (ret.length === this.props.value.length || this.props.value === 'ANTIALL') {
                        ret = [];
                    }
                }
                this.props.onChange && this.props.onChange(ret);
            } else {
                if (e.value !== 'ALL') {
                    if (this.props.value !== e.value) {
                        this.props.onChange && this.props.onChange(e.value);
                    } else {
                        this.props.onChange && this.props.onChange('');
                    }
                } else {
                    if (this.props.value !== e.value) {
                        this.props.onChange && this.props.onChange(this.getAllValue(this.props.data).join(','));
                    } else {
                        this.props.onChange && this.props.onChange('');
                    }
                }
            }
        };
        /**
         * input change事件 impure
         */
        this.handleChange = (e) => {
            this.setState(
                {
                    search: e.target.value
                }
            );
        };
        /**
         * 清除点击事件 impure
         */
        this.handleClear = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.props.onChange && this.props.onChange(this.props.multiple ? [] : '');
        };
        /**
         * 判断是否全选 pure
         * @param {array} data
         * @param {(string|string[])} value
         * @return {bool} 是否全选
         */
        this.ifSelectAll = (data, value, multiple) => {
            let ret = [];
            ret = this.getAllValue(data);
            if (multiple) {
                return value.length === ret.length || value === 'ANTIALL';
            }
            return value.indexOf(',') !== -1 && value.split(',').length === ret.length || value === 'ANTIALL';
        };
        /**
         * 根据value取对应text pure
         * @param {array} data
         * @param {(string|string[])} value
         * @return {string} text
         */
        this.mapValueToText = (data, value) => {
            if (data.length > 0 && data[0].children) {
                let ret = [];
                data.map(
                  (item) => ret = ret.concat(item.children)
                );
                return ret[_.findIndex(ret, (v) => v.value === value)] ? ret[_.findIndex(ret, (v) => v.value === value)].text : '';
            }
            return data[_.findIndex(data, (v) => v.value === value)] ? data[_.findIndex(data, (v) => v.value === value)].text : '';
        };
        /**
         * 获取全部value pure
         * @param {array} data
         * @return {array} 全部value
         */
        this.getAllValue = (data) => {
            let ret = [];
            if (data.length > 0 && data[0].children) {
                data.map(
                  (item) => {
                      item.children.map(
                          (itm) => {
                              this.props.multiple && itm.text.indexOf(this.state.search) !== -1 && ret.push(itm.value);
                              !this.props.multiple && ret.push(itm.value);
                          }
                      );
                  }
                );
            } else {
                data.map(
                (item) => {
                    this.props.multiple && item.text.indexOf(this.state.search) !== -1 && ret.push(item.value);
                    !this.props.multiple && ret.push(item.value);
                }
                );
            }
            return ret;
        };
        /**
         * 获取第一个value pure
         * @param {array} data
         * @return {string} 第一个value
         */
        this.getFirstValue = (data) => {
            if (data.length > 0 && data[0].children && data[0].children[0]) {
                return data[0].children[0].value;
            }
            return data[0] ? data[0].value : '';
        };
        /**
         * 获取最后一个value pure
         * @param {array} data
         * @return {string} 最后一个value
         */
        this.getLastValue = (data) => {
            if (data.length > 0 && data[data.length - 1].children && data[data.length - 1].children[data[data.length - 1].children.length - 1]) {
                return data[data.length - 1].children[data[data.length - 1].children.length - 1].value;
            }
            return data[data.length - 1] ? data[data.length - 1].value : '';
        };
        /**
         * 获取任意一个value pure
         * @param {array} data
         * @return {string} 任意一个value
         */
        this.getRandomValue = (data) => {
            let random = 0;
            if (data.length > 0) {
                random = _.random(0, data.length - 1);
            }
            if (data[random] && data[random].children) {
                return data[random].children[_.random(0, data[random].children.length - 1)] ? data[random].children[_.random(0, data[random].children.length - 1)].value : '';
            }
            return data[random] ? data[random].value : '';
        };
        /**
         * 转换value，获取最终显示效果 pure
         * @param {array} data
         * @param {(string|string[])} value
         * @param {(string|number)} width
         * @return {(string|object)} 实际显示结果
         */
        this.transValueForInput = (data, value, width, showAll, multiple) => {
            try {
                if (_.isArray(value)) {
                    let ret = [];
                    value.map(
                        (item) => {
                            ret.push(this.mapValueToText(data, item));
                        }
                    );
                    let str = value.length > 0 ? '【' + ret.join('】【') + '】' : '';
                    str = this.ifSelectAll(data, value, multiple) && showAll ? '全部' : this.initValue(str, width);
                    return str;
                }
                return this.ifSelectAll(data, value, multiple) && showAll ? '全部' : this.mapValueToText(data, value);
            } catch (e) {
                return '';
            }
        };
         /**
         * 获取需要的Options pure
         * @param {array} data
         * @param {(string|string[])} value
         * @param {bool} showAll
         * @param {bool} showSearch
         * @param {bool} multiple
         * @return {array} Options
         */
        this.getOptions = (data, value, showAll, showSearch, multiple) => {
            let ret = [];
            if (!_.isArray(data)) {
                throw new Error('Unable to get options from props data, please check the render of Select');
            }
            showSearch && ret.push(
              <SearchInput
                width={this.props.width}
                style={{left: 0, top: 32}}
                onChange={this.handleChange}
                value={this.state.search}
                key="searchinput"
              />);
            showAll && data.length !== 1 && ret.push(<Option
              key={'ALL'}
              value={'ALL'}
              label={'全部'}
              selected={this.ifSelectAll(data, value, multiple)}
              onClick={this.handleClick}
                                                     />);
            showAll && data.length !== 1 && !multiple && this.state.search !== '' && ret.pop();
            if (data.length > 0 && data[0].children) {
                data.map(
                    (item, index) => {
                        let mid = [];
                        item.children.map(
                            (itm, inx) => itm.text.indexOf(this.state.search) !== -1 && mid.push(
                              <Option
                                key={item.label + '' + inx}
                                value={itm.value}
                                label={itm.text}
                                selected={_.isArray(value) ? _.includes(value, itm.value) : value === itm.value}
                                disabled={itm.disabled}
                                onClick={this.handleClick}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseLeave={this.handleMouseLeave}
                              />
                             )
                        );
                        ret.push(
                          <OptGroup label={item.text} key={index}>
                             {mid}
                          </OptGroup>
                    );
                    }
                );
            } else {
                data.map(
                    (item, index) => item.text.indexOf(this.state.search) !== -1 && ret.push(
                      <Option
                        key={index}
                        value={item.value}
                        label={item.text}
                        selected={_.isArray(value) ? _.includes(value, item.value) : value === item.value}
                        disabled={item.disabled}
                        onClick={this.handleClick}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                      />
                    )
            );
            }
            return ret;
        };
        /**
         * 计算字符串的实际长度，使用了jquery impure
         * @param {string} text
         * @return {number} 字符串长度
         */
        this.computeFontWidth = (v) => {
            if (v.length > 9) {
                let d = $('.computeFontWidth');
                d.html(v);
                return d.width();
            }
            return 0;
        };
        /**
         * 美化text，当text过长时，显示项数 impure
         * @param {string} value
         * @param {(string|width)} maxWidth
         * @return {string} 美化后的text
         */
        this.initValue = (value, maxWidth) => {
            if (this.computeFontWidth(value) > (isNaN(maxWidth) ? maxWidth.replace('px', '') / 1 - 25 : maxWidth - 25)) {
                return <p>{'已选择 '}<b style={{color: '#87CEFA'}}>{value.split('】【').length}</b>{' 项'}</p>;
            }
            return value;
        };
        /**
         * 鼠标移入option事件 impure
         */
        this.handleMouseEnter = (e) => {
            this.setState({
                tipsShow: true,
                tipsStyle: e.style,
                tipsText: e.text
            });
        };
        /**
         * 鼠标移出option事件 impure
         */
        this.handleMouseLeave = () => {
            this.setState({
                tipsShow: false
            });
        };
        /**
         * 重复渲染控制
         */
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
        switch (this.props.value) {
            case 'ALL':
                this.props.onChange && this.props.onChange(this.props.multiple ? this.getAllValue(this.props.data) : this.getAllValue(this.props.data).join(','));
                break;
            case 'FIRST':
                this.props.onChange && this.props.onChange(this.props.multiple ? [this.getFirstValue(this.props.data)] : this.getFirstValue(this.props.data));
                break;
            case 'LAST':
                this.props.onChange && this.props.onChange(this.props.multiple ? [this.getLastValue(this.props.data)] : this.getLastValue(this.props.data));
                break;
            case 'ANY':
                this.props.onChange && this.props.onChange(this.props.multiple ? [this.getRandomValue(this.props.data)] : this.getRandomValue(this.props.data));
                break;
            default:
                break;
        }
    }
    render() {
        return (
          <div style={{display: 'inline-block'}}>
            <div style={{position: 'relative', ...this.props.style}}>
              <SelectInput
                width={this.props.width}
                disabled={this.props.disabled}
                open={this.state.openMenu}
                onClick={this.handleOpenMenu}
                handleClear={this.props.allowClear ? this.handleClear : false}
                value={this.transValueForInput(this.props.data, this.props.value, this.props.width, this.props.showAll, this.props.multiple)}
              />
              <DropdownMenu
                open={this.state.openMenu}
                width={this.props.width}
                showAll={this.props.showAll && this.props.multiple}
                showSearch={this.props.showSearch}
              >
                {this.getOptions(this.props.data, this.props.value, this.props.showAll, this.props.showSearch, this.props.multiple)}
              </DropdownMenu>
              <Tips text={this.state.tipsText} show={this.state.tipsShow} style={this.state.tipsStyle}/>
            </div>
            <div
              style={{top: '0px', visibility: 'hidden', fontSize: '12px', display: 'block', position: 'absolute'}}
              className="computeFontWidth"
            />
          </div>
        );
    }
}

Select.propTypes = propTypes;

Select.defaultProps = {
    width: '150px'
};

export default Select;
