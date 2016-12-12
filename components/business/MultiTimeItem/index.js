import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Form, TimePicker, Button, Select, InputNumber, message } from 'antd';
import moment from 'moment';
import { checkTimeData } from './utils';

/**
 * 组件属性申明
 *
 */
const propTypes = {

};

const FormItem = Form.Item;
/**
 * 组件主体
 */


class MultiTimeItem extends React.Component {
    constructor(props) {
        super(props);
    }

    changeTimeData(data, type, index) {
        //改变值的方法,根据type和index来判断改变的值
        //如果type为other的话,是嵌套组件的值,不对这样的值进行moment处理
        //other的值有可能需要取tartget的值,所以在取值的时候需要进行一个判断
        const { onChange, value } = this.props;
        let changeData = _.cloneDeep(value) || [{}];
        if(type !== 'other') {
            changeData[index][type] = data.format('HH:mm');
        } else {
            changeData[index][type] = data.target ? data.target.value : data;
        }
        onChange(changeData);
    }

    addTimeData() {
        //添加操作,通过props的onChange方法来改变外层的value
        const { onChange, value } = this.props;
        let changeData = _.cloneDeep(value) || [{}];
        changeData = [...changeData, {}];
        onChange(changeData);
    }

    removeTimeData(v, index) {
        //删除操作,原理同上面的添加操作
        const { onChange, value } = this.props;
        let changeData = _.cloneDeep(value) || [{}];
        changeData.splice(index, 1);
        onChange(changeData);
    }

    render() {
        let value = this.props.value || [{}];
        return (
            <div>
                {value.map((item, index) =>
                    <div
                        key = { index }
                        style = {{ marginBottom: 3 }}
                    >
                        <TimePicker
                            style={{ marginRight: 5 }}
                            size = "large"
                            format = "HH:mm"
                            value={ item.start ? moment(item.start, 'HH:mm') : null }
                            onChange = { (v) => this.changeTimeData(v, 'start', index) }

                        />
                        <span>至</span>
                        <TimePicker
                            style={{ marginLeft: 5 }}
                            size = "large"
                            format = "HH:mm"
                            value={ item.end ? moment(item.end, 'HH:mm') : null }
                            onChange = { (v) => this.changeTimeData(v, 'end', index) }
                        />
                        {this.props.children ?
                            <div style={{ display: 'inline-block', marginLeft: 5 }}>
                                {React.cloneElement(this.props.children, {
                                    onChange: (v) => this.changeTimeData(v, 'other', index)
                                })}
                            </div> : ''
                        }
                        {index == 0 ?
                            <Button
                                style={{ marginLeft: 5 }}
                                type = "primary"
                                size = "small"
                                shape = "circle"
                                onClick = { (v) => this.addTimeData(v) }
                                icon = "plus">
                            </Button> :
                            <Button
                                style={{ marginLeft: 5 }}
                                type = "primary"
                                size = "small"
                                shape = "circle"
                                onClick = { (v) => this.removeTimeData(v, index) }
                                icon = "minus">
                            </Button>
                        }
                    </div>
                )}
            </div>
        )
    }
}

MultiTimeItem.checkTimeData = checkTimeData;
export default MultiTimeItem;