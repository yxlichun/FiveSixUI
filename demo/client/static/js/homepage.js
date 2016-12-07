import React, { Component, PropTypes} from 'react';
import { Crumb } from 'comp';

export default class Homepage extends Component { 
    render() {
        return <Crumb
            data = {[{title: '骑士管理', link: 'www.baidu.com'},{title: '装备管理'}]}
        />
    }
}