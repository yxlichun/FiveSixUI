import React from 'react';
import { render } from 'react-dom';
import { TenDaysSelect, Tag } from 'comp';

render (
    <div>
        <TenDaysSelect
            value = {{ month: '2013-10', month_type: '1'}} />
        <Tag>子元素</Tag>
    </div>,
    
    document.getElementById('main-container')
)