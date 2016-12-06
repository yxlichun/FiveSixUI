import React, { Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import { OrderDetail } from 'modules/OrderDetail';
import { Input } from 'antd';

import './styles.less';

const propTypes = {
}

/**
 * 订单详情检索框；
 */
export default class OrderSearch extends React.Component {

	constructor(props) {
		super(props)
	}

	propTypes: propTypes

    searchOrder(e) {
        const { orderDetailActions: { showOrderDetail } } = this.props;
        const orderid = e.target.value;
        showOrderDetail(orderid);
    }
	render() {
        const { orderDetail, orderDetailActions } = this.props;
        return (
            <div className="order-search">
                <Input 
                    onPressEnter={ e => this.searchOrder(e) }
                    placeholder='输入订单号，回车检索'
                />
                <OrderDetail 
                    orderDetail         = { orderDetail } 
                    orderDetailActions  = { orderDetailActions }/>
            </div>
        )
	}
}