import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import './styles.less';
import { Form, TimePicker, Button, Select, InputNumber, message } from 'antd';
import Utils from './utils';
import { createOptionsFromArray } from 'utils/utils';
import moment from 'moment';
/**
 * 组件属性申明
 *
 */
const propTypes = {
    value: PropTypes.object.isRequired, // 时间段格式 [{ start: '22:00', end: '21:00' }, { start: '', end: '' }]
};

const FormItem = Form.Item;
/**
 * 计数器
 */



/**
 * 完整组件
 */
export default class MultiTimePeriod extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timeArr: [{
                start: '',
                end: '',
                price: '',
                region: 0
            }],
            statusNumber: 1
        };
    }

    getOption() {
        let option = createOptionsFromArray(this.getPrice());
        return option;
    }

    getPrice() {
        let ret = [];
        if(this.props.id == 'limit_delivery_time') {
            for(let i = -10; i < 0; i++) {
                ret.push(i);
            }
            for(let i = 0; i <= 2; i++) {
                ret.push('+' + i);
            }
        } else {
            for(let i = -2; i < 0; i++) {
                ret.push(i);
            }
            for(let i = 0; i <= 10; i++) {
                ret.push('+' + i);
            }
        }
        return ret;

    }

    onStartTimeChange(index, date, dateString) {
        const { timeArr } = this.state;
        const newTimeArr = [
            ...timeArr.slice(0, index),
            {
                start: dateString,
                end: timeArr[index].end ? timeArr[index].end : '00:00',
                region: timeArr[index].region ? timeArr[index].region : 0
            },
            ...timeArr.slice(index + 1)
        ];

        this.setState({ timeArr: newTimeArr});
        this.onChange(newTimeArr);
    }

    onEndTimeChange(index, date, dateString) {
        const { timeArr } = this.state;
        const newTimeArr = [
            ...timeArr.slice(0, index),
            {
                start: timeArr[index].start ? timeArr[index].start : '00:00',
                end: dateString,
                region: timeArr[index].region ? timeArr[index].region : 0
            },
            ...timeArr.slice(index + 1)
        ];
        this.setState({ timeArr: newTimeArr});
        this.onChange(newTimeArr);
    }
    onPriceChange(index, data) {
        const { timeArr } = this.state;
        const newTimeArr = [
            ...timeArr.slice(0, index),
            {
                start: timeArr[index].start ? timeArr[index].start  : '00:00',
                end: timeArr[index].end ? timeArr[index].end : '00:00',
                price: data
            },
            ...timeArr.slice(index + 1)
        ];
        this.setState({ timeArr: newTimeArr});
        this.onChange(newTimeArr);
    }
    onRegionChange(index, data) {
        const { timeArr } = this.state;
        const newTimeArr = [
            ...timeArr.slice(0, index),
            {
                start: timeArr[index].start ? timeArr[index].start  : '00:00',
                end: timeArr[index].end ? timeArr[index].end : '00:00',
                region: data
            },
            ...timeArr.slice(index + 1)
        ];
        this.setState({ timeArr: newTimeArr});
        this.onChange(newTimeArr);
    }

    onChange(timeArr){
        let newValue = [];
        for (let i = 0; i < timeArr.length; i++) {
            newValue.push({ ...timeArr[i] });
        }
        this.props.onChange && this.props.onChange(newValue);
    }

    addPeriod() {
        let limit = Number(this.props.limit);
        if(this.state.statusNumber <= limit - 1 || !this.props.limit) {
            const timeArr = [
                ...this.state.timeArr,
                {
                    start: '',
                    end: ''
                }
            ];

            this.setState({timeArr});
            this.onChange(timeArr);
            this.state.statusNumber ++
        } else {
            toastr.warning('最多可以设置5个时段');
            message.warning('最多可以设置5个时段');
        }
    }

    removePeriod(index) {
        const timeArr = [
            ...this.state.timeArr.slice(0, index),
            ...this.state.timeArr.slice(index + 1)
        ];

        this.setState({ timeArr });
        this.onChange(timeArr);
        this.state.statusNumber --
    }

    convertToDateObj(dateString) {
        if (dateString) {
            let date = new Date();
            const hour = Number(dateString.split(':')[0]);
            const minute = Number(dateString.split(':')[1]);

            date.setHours(hour);
            date.setMinutes(minute);

            return moment(date);
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.setState({
            timeArr: this.props.value
        });
    }

    componentWillReceiveProps (nextProps) {
        const { value } = nextProps;
        this.setState({
            timeArr: value,
            statusNumber: value.length
        });
    }

    render() {
        const { timeArr } = this.state;
        return (
            <div>
                { timeArr.map((time, index) =>
                    <div
                        className = "period-container"
                        key = { index }
                        >
                        {
                            <TimePicker
                                size = "large"
                                value = { this.convertToDateObj(time.start) }
                                format = "HH:mm"
                                onChange = {this.onStartTimeChange.bind(this, index)} />
                        }

                        {' '}至{' '}

                        {
                            <TimePicker
                                size = "large"
                                value = { this.convertToDateObj(time.end) }
                                format = "HH:mm"
                                onChange = {this.onEndTimeChange.bind(this, index)} />
                        }

                        {' '}

                        {
                            this.props.price ?
                            <Select
                                style={{ width: 80,marginLeft: 50,marginBottom: 3 }}
                                size = "large"
                                value = { time.price != "" && time.price >= 0 && time.price.slice(0, 1) != '+' ? '+' + time.price : time.price }
                                onChange = {this.onPriceChange.bind(this, index)}
                            >
                                { this.getOption() }
                            </Select>
                            : ''
                        }

                        {
                            this.props.region ?
                            <span>
                                配送半径
                                <InputNumber
                                    min = { 0 }
                                    value = { time.region }
                                    style={{ width: 60,marginLeft: 10,marginBottom: 3,marginRight:10 }}
                                    onChange = {this.onRegionChange.bind(this, index)}
                                />
                                km
                            </span>
                            : ''
                        }

                        {
                            index === 0
                            ? <Button
                                    className = "period-button"
                                    type = "primary"
                                    size = "small"
                                    shape = "circle"
                                    icon = "plus"
                                    onClick = {this.addPeriod.bind(this)}>
                                </Button>
                                : <Button
                                    className = "period-button"
                                    type = "primary"
                                    size = "small"
                                    shape = "circle"
                                    icon = "minus"
                                    onClick = {this.removePeriod.bind(this, index)}>
                                </Button>
                        }
                    </div>
                )}
			</div>
        );
    }
}
