/**
* @file 时间段选择组件
*       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
* 
* @author lichun<lichun@iwaimai.baidu.com>
* @version 0.0.1
* 
*/
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Input, Select, Button, Radio, DatePicker, notification } from 'antd';
import { getRangeValByType, transferDate } from './utils';
import { DEFAULT_DATE_FORMAT, DEFAULT_OPTIONS, DATE_TYPE, DEFAULT_MAX_INTERVAL, PARAMS_MAP } from './constant';
import './styles.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

/**
 * 组件属性申明
 *
 * @property {array}         options          可选的类型              默认值：['today', 'yesterday', 'tomorrow', 'lastWeek', 'lastMonth', 'customize']
 * @property {string}        defaultType      默认选中类型            默认值：使用options属性的第一个值
 * @property {string|array}  customizeDefault 自定义默认选中的时间段  默认值：使用options属性的第一个值
 * @property {string|number} dateFormat       用于请求的日期格式      默认值：'YYYY-MM-DD'
 * @property {number}        maxInterval      最长时间间隔            默认值：35
 * @property {bool}          removeDateTool   是否需要去除日期工具    默认值：false
 * @property {bool}          allowRangeClear  日期区间选择是否显示清除按钮  默认值：false
 * @property {bool}          disabled         是否可编辑              默认值：false
 * @property {func}          onChange         变化时回调函数
 * @property {func}          disabledDate     不可选的日期 
 */
const propTypes = {
    options: PropTypes.array,
    defaultType: PropTypes.string,
    customizeDefault: PropTypes.oneOfType([
        React.PropTypes.oneOf(DEFAULT_OPTIONS), 
        React.PropTypes.array
    ]),
    dateFormat: PropTypes.string,
    maxInterval: PropTypes.oneOfType([
        React.PropTypes.string, 
        React.PropTypes.number
    ]),
    removeDateTool: PropTypes.bool,
    allowRangeClear: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    disabledDate: PropTypes.func
};

/**
 * 主组件
 * 
 * @export
 * @class SearchPeriod
 * @extends {React.Component}
 */
export default class SearchPeriod extends React.Component {
    static defaultProps = {
        options: DEFAULT_OPTIONS,
        dateFormat: DEFAULT_DATE_FORMAT,
        maxInterval: DEFAULT_MAX_INTERVAL,
        removeDateTool: false,
        allowRangeClear: false,
        disabled: false
    };

    constructor(props) {
        super(props);

        /**
         * state属性申明
         *
         * @property {bool}         isCustomize   当前类型是否自定义
         * @property {array}        rangeVal      当前的日期区间值
         * @property {array|bool }  removedDates  当前的去除日期（false时，无去除日期工具）
         */
        const customizeDefault = props.customizeDefault || 'customize';
        this.state = {
            isCustomize: props.defaultType === 'customize',
            rangeVal: this.getRangeValue(null, props),
            removedDates: props.removeDateTool? [] : false
        }

        /**
         * 更改日期类型时的回调函数
         * 
         * @param {object} e 事件对象
         * 
         * @memberOf SearchPeriod
         */
        this.changeType = (e) => {
            const type = e.target.value;
            const isCustomize = (type === 'customize');
            const rangeVal = this.getRangeValue(type, this.props);
            const removedDates = [];

            this.setState({ isCustomize, rangeVal, removedDates });
            return this.recalculateValue(rangeVal, removedDates, this.props.dateFormat);
        }

        /**
         * 更改日期区间值组件时的回调函数
         * 
         * @param {array} newRange 日期区间值
         * 
         * @memberOf SearchPeriod
         */
        this.changeRangeVal = (newRange) => {
            const maxInterval = Number(this.props.maxInterval) || DEFAULT_MAX_INTERVAL;
            const maxEnd = moment(newRange[0]).add(maxInterval, 'days');
            const oldRange = this.state.rangeVal;
            const removedDates = [];

            let rangeVal;

            if (moment.min(newRange[1], maxEnd) == maxEnd) {
                rangeVal = oldRange;
                notification.warning({
                    message: '注意',
                    description: '时间选择最大间隔为' + maxInterval + '天'
                });
            } else {
                rangeVal = newRange;
            }

            this.setState({ rangeVal, removedDates });

            return this.recalculateValue(rangeVal, removedDates, this.props.dateFormat);
        }

        /**
         * 更改移除日期工具时的回调函数
         * 
         * @param {array} removedDates 移除的日期数组
         * 
         * @memberOf SearchPeriod
         */
        this.changeRemovedDates = (removedDates) => {
            this.setState({ removedDates });
            return this.recalculateValue(this.state.rangeVal, removedDates, this.props.dateFormat);
        }
    }
    
    propTypes: propTypes

    render() {
        const { isCustomize, rangeVal, removedDates } = this.state;
        const { options, defaultType, dateFormat, onChange, removeDateTool, disabledDate, allowRangeClear, disabled } = this.props;
        
        return (
            <div>
                { options.length === 1 && options[0] === 'customize' ? '' :
                    <RadioGroup  
                        className = "wl-searchperiod-type"
                        size = "large"
                        defaultValue = { defaultType || options[0] }
                        disabled = { disabled }
                        onChange = { (event) => onChange(this.changeType(event)) }>
                        { 
                            options.map(item => <RadioButton 
                                key = { item }
                                value = { item }
                            > 
                            { DATE_TYPE.map(type => {
                                if (type.name === item) {
                                    return type.text;
                                }})
                            }
                        </RadioButton>
                        )}
                    </RadioGroup>
                }

                <RangePicker 
                    size = "large"
                    format = { DEFAULT_DATE_FORMAT } 
                    disabled = { !isCustomize || disabled }
                    value = { rangeVal }
                    allowClear = { allowRangeClear }
                    onChange = { (value) => onChange(this.changeRangeVal(value)) }
                    disabledDate = { disabledDate ? (cur) => disabledDate(cur) : (cur) => this.defaultDisabledDate(cur, options, moment().startOf('day')) }/>

                { 
                    removeDateTool ? 
                    <div className = "wl-searchperiod-removedate">
                        <label>去除日期：</label>
                        <Select 
                            multiple
                            ref = 'removeDateTool'
                            style = {{ width: 230 }}
                            disabled = { disabled }
                            placeholder = "请选择需剔除日期"
                            value = { removedDates }
                            onChange = { (value) => onChange(this.changeRemovedDates(value)) }
                            getPopupContainer = { () => document.getElementById('content') }>
                            { this.getAllDatesOption(rangeVal) }
                        </Select>
                    </div> : ''
                }
            </div>
        )
    }
    /**
     * 重新计算组件值, pure
     * 
     * @param {array} rangeVal 日期区间值
     * @param {array} removedDates 移除日期
     * @param {string} dateFormat 日期格式
     * 
     * @return {object} 组件值
     * 
     * @memberOf SearchPeriod
     */
    recalculateValue(rangeVal, removedDates, dateFormat) {
        const formatRange = transferDate(rangeVal, dateFormat);
        let compValue = {};

        compValue[PARAMS_MAP[0]] = formatRange[0];
        compValue[PARAMS_MAP[1]] = formatRange[1];

        if (removedDates) {  
            compValue[PARAMS_MAP[2]] = removedDates;
        }

        return compValue;
    }

    /**
     * 获取range值, pure
     * 
     * @param {object} props 组件属性
     * 
     * @return {array} range值
     * 
     * @memberOf SearchPeriod
     */
    getRangeValue (rangeType, props) {
        let type = rangeType || props.defaultType || props.options[0];

        if (type ===  DATE_TYPE[5].name) {
            if(props.customizeDefault && $.isArray(props.customizeDefault) && props.customizeDefault.length === 2) {
                return props.customizeDefault;
            } else {
                type = props.customizeDefault || props.options[0];
            }
        }

        return getRangeValByType(type);
    }

    /**
     * 获取区间内所有日期的Option数组, pure
     * 
     * @param {array} rangeVal 日期区间
     * 
     * @return {array} 所有日期的Option数组
     * 
     * @memberOf SearchPeriod
     */
    getAllDatesOption (range) {
        let selectDates = [];
        if (range) {
            let startDate = moment(range[0], DEFAULT_DATE_FORMAT);
            const endDate = moment(range[1], DEFAULT_DATE_FORMAT);

            while (moment.min(startDate, endDate) == startDate) {
                let formatDate = startDate.format(DEFAULT_DATE_FORMAT);

                selectDates.push(
                    <Select.Option value={formatDate} key={formatDate}>
                        {formatDate}
                    </Select.Option>
                );

                startDate.add(1, 'days');
            }
        }
        return selectDates;
    }

    /**
     * 默认不可选日期函数(根据配置选项，确定不可选范围), pure
     * 
     * @param {date} current
     * @param {array} options
     * @param {moment} now
     * 
     * @return {bool} 是否是不可选日期
     * 
     * @memberOf SearchPeriod
     */
    defaultDisabledDate(current, options, baseDate) {
        let past = false, future = false, now = false, isdisabled = false;
        let curDate = moment(current.valueOf());
        let mapping = {};

        DATE_TYPE.map(type => {
            mapping[type.name] = type.relative;
        });

        for (let i = 0, len = options.length; i < len; i++) {
            switch(mapping[options[i]]) {
                case 0:
                    now = true;
                    break;
                case 1:
                    future = true;
                    break;
                case -1:
                    past = true;
                    break;
            }
        }

        // 有过去无未来
        if (past && !future) {
            //包括今天
            if (now) { 
                isdisabled = current && curDate.isAfter(baseDate);
            } else {
                isdisabled = current && curDate.isSameOrAfter(baseDate);
            }
        }

        // 有未来无过去
        if (!past && future) {
            //包括今天
            if (now) {
                isdisabled = current && curDate.isBefore(baseDate);
            } else {
                isdisabled = current && curDate.isSameOrBefore(baseDate);
            }
        }

        return isdisabled;
    }
}
