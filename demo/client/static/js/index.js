import React from 'react';
import { render } from 'react-dom';
import TenDaysSelect from '../../../../components/basic/tendays-select';

render (
    <div>
        <TenDaysSelect
            value = {{ month: '2013-10', month_type: '1'}} />
    </div>,
    
    document.getElementById('main-container')
)