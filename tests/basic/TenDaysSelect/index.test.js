import React from 'react';
import { render, shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { TenDaysSelect } from '../../../components';
import { DISABLED_SELECT_CLASS } from '../../constants';

describe('TenDaysSelect', () => {
    // 基础测试
    it('Test prop: value', () => {
        const month = '2013-10';
        const month_type = '1';

        const wrapper = mount(
            <TenDaysSelect 
                value = { { month, month_type } }
            />
        );
        expect(wrapper.find('[value="' + month + '"]')).to.have.length(1);
        expect(wrapper.find('[title="上旬"]')).to.have.length(1);

        wrapper.setProps({value: {month, month_type: '2'}});
        expect(wrapper.find('[title="中旬"]')).to.have.length(1);
        // month_type=number
        wrapper.setProps({value: {month, month_type: 3}});
        expect(wrapper.find('[title="下旬"]')).to.have.length(1);
    });

    it('Test porp: disabled', () => {
        const wrapper = mount(
            <TenDaysSelect 
                disabled = { true }
            />
        );
        expect(wrapper.find('[disabled]')).to.have.length(1);
        expect(wrapper.find(DISABLED_SELECT_CLASS)).to.have.length(1);
    });
    it('Test prop: onChange', () => {
        const value = {
            month: '2013-11', 
            month_type: '1'
        };

        const onDateChange = sinon.spy();
        const wrapper = shallow(
            <TenDaysSelect 
                onChange = { onDateChange }
                value = { value }
            />
        );
        expect(onDateChange).to.have.property('callCount', 1);

        // wrapper.simulate('change', { target: {
        //     month: '2013-11', 
        //     month_type: '3'
        // }});
        // expect(onDateChange).to.have.property('callCount', 2);
    });
    it('Test circle: init with value', () => {
        const value = {
            month: '2013-11', 
            month_type: '1'
        };

        const onDateChange = sinon.spy();
        const wrapper = mount(
            <TenDaysSelect 
                onChange = { onDateChange }
                value = { value }
            />
        );
        expect(onDateChange).to.have.property('callCount', 1);
        expect(onDateChange.calledWith(value)).to.be.true;
    });
    it('Test circle: init without value', () => {
        const value = {
            month: moment().format('YYYY-MM'), 
            month_type: moment().format('DD').slice(0, 1) - (-1) + ''
        };

        const onDateChange = sinon.spy();
        const wrapper = mount(
            <TenDaysSelect 
                onChange = { onDateChange }
            />
        );
        expect(onDateChange).to.have.property('callCount', 1);
        expect(onDateChange.calledWith(value)).to.be.true;
    });
});

