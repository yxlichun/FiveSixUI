import React from 'react';
import { findDOMNode } from 'react-dom'

import { Link } from 'react-router';
import { Menu, Icon, Switch } from 'antd';
import { getQueryString, getActionName } from 'utils/utils';
import { auth, checkAuth } from 'src/authController';
import { generateHref } from './utils';

import './styles.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

let actionRoot;

/**
 * 驿站左侧导航栏组件
 * 每个顶级nav为一个页面，顶级nav的key与tpl请求路径名称严格一致同时与顶级包名一致
 */
export default class CommonNav extends React.Component {
    constructor(props) {
        super(props);

        const { page, changeNavStates, navStates } = props;
        let newStates = navStates;

        if (!(navStates.selectedKeys && $.isArray(navStates.selectedKeys) && navStates.selectedKeys.length > 0)){
            newStates = {
                selectedKeys: this.getSelectedKeys() || [page],
                defaultOpenKeys: this.getDefaultOpenKeys(page),
                fold: false
            }
            // update props
            changeNavStates && changeNavStates(newStates);
        }
        // update state
        this.state = {
            ...newStates,
            openKeys: []
        }
        this.setCrumb([...newStates.defaultOpenKeys, ...newStates.selectedKeys]);
    }
    setCrumb(path) {
        const { items, changeControl } = this.props;
        let crumbArr = [];
        let navArray = items;
        if (changeControl && items) {
            for (let i = 0; i < path.length; i++) {
                if (navArray) {
                    for (let j = 0; j < navArray.length; j++) {
                        if (path[i] === navArray[j]['key']) {
                            crumbArr.push({
                                title: navArray[j]['text']
                            });
                            navArray = navArray[j]['children'];
                            break;
                        }
                    }
                }
            }
            changeControl(crumbArr);
        }
    }
    componentWillReceiveProps(nextProps) {
        const { navStates: { fold, selectedKeys, defaultOpenKeys } } = this.props;
        const newFold = nextProps.navStates.fold;
        if (newFold && !fold) { //折叠
            this.foldMenu();
        }
        if (fold && !newFold) { //展开
            this.unfoldMenu();
        }
        if(this.props.openKeys.sort().toString() !== nextProps.openKeys.sort().toString()) {
            this.setState({
                openKeys: nextProps.openKeys
            })
        }
        if (!this.compareProps(nextProps, this.props)) {
            this.setCrumb([...nextProps.navStates.defaultOpenKeys, ...nextProps.navStates.selectedKeys]);
            this.setState({
                ...nextProps.navStates,
                openKeys: nextProps.navStates.defaultOpenKeys
            });
        }
    }
    compareProps(newProps, oldProps) {
        if (newProps.navStates && oldProps.navStates) {
            let newSelectedKeys = newProps.navStates.selectedKeys;
            let oldSelectedKeys = oldProps.navStates.selectedKeys;
            if (newSelectedKeys && oldSelectedKeys && $.isArray(newSelectedKeys) && $.isArray(oldSelectedKeys)) {
                if (newSelectedKeys.join() !== oldSelectedKeys.join()) {
                    return false;
                }
            }
        }
        return true;
    }
    foldMenu() {
        const { changeNavStates, navStates } = this.props;
        $(findDOMNode(this.refs.nav)).find('.ant-menu-submenu-open ul').addClass('hidden');
        changeNavStates && changeNavStates({
            ...navStates,
            fold: !navStates.fold
        });
    }
    unfoldMenu() {
        const { changeNavStates, navStates } = this.props;
        $(findDOMNode(this.refs.nav)).find('.ant-menu-submenu-open ul').removeClass('hidden');
        changeNavStates && changeNavStates({
            ...navStates,
            fold: !navStates.fold
        });
    }
    openMenu(e) {
        this.setState({
            openKeys: e
        })
        const { foldControl, navStates } = this.props;
        if (navStates.fold) {// 在折叠状态
            this.unfoldMenu();
            foldControl && foldControl();
        }
    }

    findactionRoot(key, data){
        let me = this;
        data.forEach(function(data){
            if(data.key == key) {
                actionRoot = data.actionRoot;
            }
            if(data.children){
                me.findactionRoot(key, data.children);
            }
        });
        return actionRoot;
    }

    handleClick(e) {
        const { actionRoot, changeControl, navStates, changeNavStates, devEnv: { ip, port, phpName} } = this.props;
        const { props } = e.item;

        if (props.link) {
            window.open(props.link);
        }
        if (navStates.fold) {
            this.openMenu();
            return;
        }
        let pathArray = e.keyPath;
        let reversePathArray = [...pathArray].reverse();
        let reverseHashPathArray = reversePathArray.slice(1);

        // this.setCrumb(reversePathArray);

        let actionName = pathArray[pathArray.length - 1];
        let hashPath = reverseHashPathArray.join('/')

        const devActionName = getQueryString('devPage');
        const proActionName = getActionName();

        if (actionName === devActionName || actionName === proActionName){
            // 页内切换
            location.hash = hashPath;
        } else {
            location.href = generateHref(this.findactionRoot(e.key, this.props.items) || actionRoot, actionName, hashPath, { ip, port, phpName })
        }
        changeNavStates && changeNavStates({
            ...navStates,
            selectedKeys: reverseHashPathArray,
            defaultOpenKeys: this.state.openKeys
        });
        this.setState({
            selectedKeys: reverseHashPathArray,
            defaultOpenKeys: [actionName]
        })
    }

    getSelectedKeys() {
        const hashStr = location.hash;
        let routeHash = hashStr.split('?')[0];
        let routeHashPathArray = routeHash.split('/');
        if (routeHashPathArray.length > 1 && routeHashPathArray[1] !== '') {
            return [routeHashPathArray[routeHashPathArray.length - 1]];
        } else {
            if (location.href.indexOf('homepage') != -1) {
                return ['homepage'];
            }
            return null;
        }
    }
    
    getDefaultOpenKeys(page) {
        let defaultOpenKeys = [];
        defaultOpenKeys.push(page);

        const hashStr = location.hash;
        const routeHash = hashStr.split('?')[0];
        const routeHashPathArray = routeHash.split('/');
        if (routeHashPathArray.length > 1 && routeHashPathArray[1] !== '') {
            const filtered = routeHashPathArray.slice(1, routeHashPathArray.length - 1);
            defaultOpenKeys = defaultOpenKeys.concat(filtered);
        }
        return defaultOpenKeys;
    }
    checkSubItemsAuth(items) {
        for (let i = 0; i < items.length; i++) {
            if (checkAuth(items[i])) {
                return true;
            }
        }
        return false;
    }
    render() {
        const { items, height } = this.props;
        const { selectedKeys, defaultOpenKeys, openKeys } = this.state;
        return (
          <div className="common-nav" style={{ height }}>
              <Menu theme='dark'
                  onClick={ event => this.handleClick(event) }
                  onOpenChange={ event => this.openMenu(event)}
                  style={{ width: 200 }}
                  selectedKeys={ selectedKeys }
                  defaultOpenKeys={ defaultOpenKeys }
                  openKeys = { openKeys }
                  mode="inline"
                  ref="nav"
              >
                { this.getMenuItems(items, true) }
              </Menu>
          </div>
        );
    }
    getMenuItems(items, sub) {
        let menuItems = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (checkAuth(item)) {
                if (item && item.children && this.checkSubItemsAuth(item.children)) {
                    let childrenItems = this.getMenuItems(item.children, true);
                    if (sub) {
                        menuItems.push(
                            <SubMenu 
                                key={item.key} 
                                title={item.iconType ? (<span><Icon type={item.iconType} /><span>{item.text}</span></span>) : (<span>{item.text}</span>)}>
                                { childrenItems }
                            </SubMenu>
                        )
                    } else {
                        menuItems.push(childrenItems);
                    }
                } else if(!item.children) {
                    menuItems.push(<Menu.Item 
                        key={item.key}
                        link = { item.link }
                        >
                        { item.iconType ? (<span><Icon type={item.iconType} /><span>{item.text}</span></span>) : (<span>{item.text}</span>) }
                        </Menu.Item>
                    );
                }
            }
        }
        return menuItems;
    }
}
