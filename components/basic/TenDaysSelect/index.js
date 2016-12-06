/**
 * @file 旬选择组件，自动选择当前时间所对应的旬
 *       modified by lichun<lichun@iwaimai.baidu.com>
 * 
 * @author wangjuan01 <wangjuan01@iwaimai.baidu.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react';
import { DatePicker, Select } from 'antd';
import moment from 'moment';

const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;
moment.locale('zh-cn');

/**
 * 组件属性申明
 *
 * @property {function} onChange
 * @property {bool} disabled
 * @property {object} value { month: '2013-10', month_type: '1'} 2013年10月上旬
 * @property {moment} startMoment 起始时间 
 * @property {moment} endMoment 结束时间
 * @property {string} monthFormat 使用moment的月份格式化字符串 default='YYYY-MM'
 */
const propTypes = {
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    startMoment: PropTypes.object,
    endMoment: PropTypes.object,
    monthFormat: PropTypes.string
};

/**
 * 主组件
 * 
 * @export
 * @class DateTenSelect
 * @extends {React.Component}
 */
export default class TenDaysSelect extends React.Component {
    /**
     * Creates an instance of DateTenSelect.
     * 
     * @param {any} props
     * 
     * @memberOf DateTenSelect
     */
    constructor(props) {
        super(props);

        const { value } = props;

        this.monthFormat = props.monthFormat || 'YYYY-MM';

        // this.month为format后的字符串，而非moment()
        this.month = (value && value.month) ? value.month : this.getMonth(moment(), this.monthFormat);
        this.month_type = (value && value.month_type) ? value.month_type : this.getTenNum(moment());
    }

    componentWillMount() {
        const { onChange } = this.props;

        onChange && onChange({
            month: this.month,
            month_type: this.month_type
        })
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.value) {
            this.month = nextProps.value.month || this.month;
            this.month_type = nextProps.value.month_type || this.month_type;
        }
    }
    
    /**
     * 判断日期是否在可选范围之内 pure
     * 
     * @param {moment} current
     * @param {moment} startMoment
     * @param {moment} endMoment
     * @return {bool} 是否是不可选日期
     * 
     * @memberOf DateTenSelect
     */
    disabledDate(current, startMoment, endMoment) {
        return !((!startMoment || (startMoment && current.valueOf() > startMoment.unix()*1000)) && (!endMoment || (endMoment && current.valueOf() < endMoment.unix()*1000)))
    }
    /**
     * 根据给定日期返回年月 pure
     * 
     * @param {moment} mom
     * @param {string} format
     * @return {string} format Year&Month like 2013-04
     * 
     * @memberOf DateTenSelect
     */
    getMonth(mom, format) {
        return mom.format(format || 'YYYY-MM');
    }
    /**
     * 根据给定日期返回旬 pure
     * 
     * @param {moment} mom
     * @return {string} 旬
     * 
     * @memberOf DateTenSelect
     */
    getTenNum(mom) {
        const day = mom.format('DD');
        switch(day.slice(0, 1)) {
            case '0':
                return '1';
            case '1':
                return '2';
            default:
                return '3';
        }
    }

    changeMonth(value) {
        const { onChange } = this.props;
        this.month = this.getMonth(value, this.monthFormat);

        onChange && onChange({
            month: this.month,
            month_type: this.month_type
        })
    }

    changemonthType(value) {
        const { onChange } = this.props;
        this.month_type = value;
        
        onChange && onChange({
            month: this.month,
            month_type: this.month_type
        })
    }

    render() {
        const { disabled, startMoment, endMoment } = this.props;
        return (
            <div>
                <MonthPicker 
                    value = { this.month ? moment(this.month, this.monthFormat) : '' } 
                    style = {{ width: 100 }} 
                    disabledDate = { (current) => this.disabledDate(current, startMoment, endMoment) } 
                    disabled = { !!disabled }
                    placeholder = '请选择月份'
                    onChange = { (value) => this.changeMonth(value) }/>
                <Select  
                    value = { this.month_type + '' }
                    style = {{ marginLeft: 10, width: 80 }} 
                    disabled = { !!disabled }
                    onChange = { (value) => this.changemonthType(value) }>
                    <Option value="1">上旬</Option>
                    <Option value="2">中旬</Option>
                    <Option value="3">下旬</Option>
                </Select>
			</div>
        );
    }
}
