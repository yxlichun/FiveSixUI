import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Tag } from '../../../components';

describe('Tag', () => {
    // 基础测试
    it('Test children', () => {
        const wrapper = shallow(
            <Tag>
                子元素
            </Tag>
        );
        expect(wrapper).to.have.text('子元素');
    });
    it('Test prop: value', () => {
        const wrapper = mount(
            <Tag
                value = { 1000 }
            >
                子元素
            </Tag>
        );
        expect(wrapper.props().value).to.equal(1000);
    });
    it('Test prop: selected = false', () => {
        const wrapper = shallow(
            <Tag
                selected = { false }
            >
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-selected')).to.have.length(0);
    });
    it('Test prop: selected = true', () => {
        const wrapper = shallow(
            <Tag
                selected = { true }
            >
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-selected')).to.have.length(1);
    });
    it('Test prop: selected not defined(equal false)', () => {
        const wrapper = shallow(
            <Tag>
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-selected')).to.have.length(0);
    });
    it('Test prop: onClick', () => {
        const onTagClick = sinon.spy();
        const wrapper = shallow(
            <Tag
                onClick = { onTagClick }
            >
                子元素
            </Tag>
        );
        wrapper.find('.wl-tag').simulate('click');
        expect(onTagClick).to.have.property('callCount', 1);
    });
    it('Test prop: closable = false', () => {
        const wrapper = shallow(
            <Tag
                closable = { false }
            >
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-close')).to.have.length(0);
    });
    it('Test prop: closable = true', () => {
        const wrapper = shallow(
            <Tag
                closable = { true }
            >
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-close')).to.have.length(1);
    });
    it('Test prop: closable not defined(equal true)', () => {
        const wrapper = shallow(
            <Tag>
                子元素
            </Tag>
        );
        expect(wrapper.find('.wl-tag-close')).to.have.length(1);
    });
    it('Test prop: onClose', () => {
        const onTagClose = sinon.spy();
        const value = 1000;
        const wrapper = shallow(
            <Tag
                onClose = { onTagClose }
                value = { value }
            >
                子元素
            </Tag>
        );
        wrapper.find('.wl-tag-close').simulate('click');
        expect(onTagClose).to.have.property('callCount', 1);
        expect(onTagClose.calledWith(value)).to.be.true;
    });

    //实际引用
    it('Test Example: TagsField组件', () => {
        const onClickTag = sinon.spy();
        const onCloseTag = sinon.spy();
        const key = 1000;
        const wrapper = mount(
            <Tag
                key = { key }
                onClick = { onClickTag }
                onClose = { onCloseTag }
                value = { key }
                selected = { true }
                >
                label
            </Tag>
        );
        wrapper.find('.wl-tag').simulate('click');
        expect(onClickTag).to.have.property('callCount', 1);

        expect(wrapper.find('.wl-tag-close')).to.have.length(1);
        wrapper.find('.wl-tag-close').simulate('click');
        expect(onCloseTag).to.have.property('callCount', 1);
        
        expect(wrapper.props().value).to.equal(key);
        
        expect(wrapper.find('.wl-tag-selected')).to.have.length(1);
        wrapper.setProps({selected: false});
        expect(wrapper.find('.wl-tag-selected')).to.have.length(0);
    });
    it('Test Example: 驿站>操作日志', () => {
        const onTagClick = sinon.spy();
        const key = 1000;
        const wrapper = mount(
            <Tag
                key = { key }
                onClick = { onTagClick }
                value = { key }
                selected = { true }
                closable = "false"
            >
                label
            </Tag>
        );
        wrapper.find('.wl-tag').simulate('click');

        expect(onTagClick).to.have.property('callCount', 1);
        expect(wrapper.props().value).to.equal(key);
        expect(wrapper.find('.wl-tag-close')).to.have.length(0);

        expect(wrapper.find('.wl-tag-selected')).to.have.length(1);
        wrapper.setProps({selected: false});
        expect(wrapper.find('.wl-tag-selected')).to.have.length(0);
    });
});

