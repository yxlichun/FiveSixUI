import React, { Component, PropTypes} from 'react';
import { Select } from 'comp';

export default class Homepage extends Component { 
    render() {
        return <Select 
            data = {[{value: '1', text: 'lichucnhun'}]}
            value = '1'
        />
    }
}