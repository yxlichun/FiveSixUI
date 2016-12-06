import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import moment from 'moment';
import Utils from './utils';

const Group = Button.Group;
const {JSONToExcelConvertor, JSONToCsvConvertor} = Utils;

// props：
// data 【object】需要下载的数据
// {
//     data, dataTable的data
//     columns, dataTable的columns
//     fileName, 文件名，自动加上时间戳
// }
// config 【array】文件格式
// ['csv', 'xls'] 目前只支持这种
// tips 【string】提示
// 放在表格第一行，不设或设空时忽略


class ExportExcelButton extends Component {
    downloadHandel(type) {
        const fileName = this.props.data.fileName;
        const data = [];
        for (let i = 0; i < this.props.data.data.length; i++) {
            let dataLine = [];
            for (let j = 0; j < this.props.data.columns.length; j++) {
                let column = this.props.data.columns[j];
                let dataRow = this.props.data.data[i];
                let _data = dataRow[column.dataIndex];
                if (column.render) {
                    _data = typeof column.render(_data, dataRow) === 'object' ? _data : column.render(_data, dataRow);

                    let child = _data;
                    let getChildValue = (child) => {
                        if(child && child.props) {
                            getChildValue(child.props.children);
                        } else {
                            _data = child;
                            return;
                        }

                    }
                    getChildValue(child);

                }
                dataLine.push(
                    {
                        'value': _data && _data.replace ? _data.replace(',', '/') : _data
                    }
                );
            }
            data.push(dataLine);
        }
        const columns = [];
        this.props.data.columns.map(
            (item) => columns.push({
                'value': item.title
            })
        );
        type === 'csv'
        ? JSONToCsvConvertor(data, fileName + moment().format('YYYYMMDD_hhmm'), columns, this.props.tips)
        : JSONToExcelConvertor(data, fileName + moment().format('YYYYMMDD_hhmm'), columns, this.props.tips);
    }
    render() {
        const items = this.props.config;
        let ret = '';
        if (items.length === 1) {
            ret
            = <Button
              type="primary"
              icon="download"
              onClick={()=>this.downloadHandel(items[0])}
            >
            下载
            </Button>;
        } else {
            ret
            = <Group style={{marginLeft: 10, marginRight: 10}}>
                {items.map(
                (item, index) =>
                  <Button
                    type="primary"
                    icon={!index ? 'download' : ''}
                    onClick={()=>this.downloadHandel(item)}
                    key={item}
                  >
                  {item}
                  </Button>
            )}
            </Group>
        }
        return ret;
    }
}

ExportExcelButton.propTypes = {
    config: PropTypes.array,
    data: PropTypes.object,
    tips: PropTypes.string
};

export default ExportExcelButton;
