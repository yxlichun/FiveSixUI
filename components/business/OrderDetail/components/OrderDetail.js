import React, { PropTypes } from 'react';
import { Form,Modal, Button,Row, Col,Table } from 'antd';
import { IMMEDIATE_DELIVER, ORDER_STATUS_DETAIL } from 'utils/constant';
import moment from 'moment';
import AnotherImageModal from 'modules/AnotherImageModal';

import './styles.less';

const FormItem = Form.Item;

/**
 * 组件属性申明
 */
const propTypes = {
}

const productColumns = [
	{
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		width: 30
	}, {
		title: '菜品名称',
		dataIndex: 'name',
		key: 'name',
		width: 100
	}, {
		title: '单价',
		dataIndex: 'current_price',
		key: 'current_price',
		width: 50
	}, {
		title: '数量',
		dataIndex: 'number',
		key: 'number',
		width: 50
	}, {
		title: '总价',
		dataIndex: 'total',
		key: 'total',
		width: 50
	}, {
		title: '折扣',
		dataIndex: 'shop_discount',
		key: 'shop_discount',
		width: 50,
		render: (text, record) => { 
			return text === 1 ? "" :((text * 10 ).toFixed(1) + "折")
		}
	}, {
		title: '折后价',
		dataIndex: 'discount_price',
		key: 'discount_price',
		width: 50
	}]

const sys_logColumns = [
	{
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		width: 40
	},{
		title: '操作记录',
		dataIndex: 'content',
		key: 'content',
		width: 300
	}, {
		title: '操作时间',
		dataIndex: 'time',
		key: 'time',
		width: 150
	}, {
		title: '操作人',
		dataIndex: 'operator',
		key: 'operator',
		width: 150
	}]

const operate_logColumns = [{
		title: '操作',
		dataIndex: 'operate_show',
		key: 'operate_show',
		width: 100
	}, {
		title: '订单状态',
		dataIndex: 'content',
		key: 'content',
		width: 250
	}, {
		title: '操作时间',
		dataIndex: 'create_time',
		key: 'create_time',
		width: 150,
		render:(text,record)=>{
			return moment(text * 1000).format('YYYY/MM/DD HH:mm:ss')
		}
	}, {
		title: '操作员',
		dataIndex: 'operator',
		key: 'operator',
		width: 150
	}, {
		title: '备注',
		dataIndex: 'description',
		key: 'description',
		width: 100
	}]

	

/**
 * 完整组件
 */
export default class OrderDetail extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			orderTicketModalShow: false,
			orderTicketImgUrl: ''
		}
	}

	componentDidMount() {
    }

	componentWillReceiveProps(nextProps) {
		let newUrl = '';
		let oldUrl = '';
		if (nextProps.orderDetail.orderTicketModal ){
			newUrl = nextProps.orderDetail.orderTicketModal.imgUrl;
		}
		if (this.props.orderDetail.orderTicketModal){
			oldUrl = this.props.orderDetail.orderTicketModal.imgUrl;
		}
		if (newUrl != oldUrl) {
			this.setState({
				orderTicketImgUrl: newUrl,
			})
		}
		if (nextProps.orderDetail.orderTicketModal && nextProps.orderDetail.orderTicketModal.show != this.state.orderTicketModalShow) {
			this.setState({
				orderTicketModalShow: nextProps.orderDetail.orderTicketModal && nextProps.orderDetail.orderTicketModal.show
			})
		}
	}

	closeOrderTicketModal() {
		const { changeOrderTicket } = this.props.orderDetailActions;
		changeOrderTicket('', false);
	}
	showOrderTicket(orderid) {
		const { getOrderTicket } = this.props.orderDetailActions;
		getOrderTicket(orderid);
	}

	tableDataPipe(tableArr) {
		if ($.isArray(tableArr)) {
			return tableArr.map((item, index) => {
				if (!item.key) {
					item.key = index + 1;
				}
				if (!item.id) {
					item.id = index + 1;
				}
				return item;
			});
		} else {
			return tableArr
		}
	}

	render() {
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
	    };
		const { orderDetail,show } = this.props.orderDetail;
		const { closeOrderDetail }= this.props.orderDetailActions;
		const basic = orderDetail && orderDetail.basic;
		const detail = orderDetail && orderDetail.detail;
		
		return  (
			basic?(
			<div>
			<Modal title={"订单号："+orderDetail.basic.orderid}
                visible={show}
                width={"70%"}
                footer={null}
                onCancel={closeOrderDetail}
				className="order-detail-modal"
            >
            	<div className="basic-section">
	                <Row gutter={16}>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>商户名称：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.shop_name}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>用户账户：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.pass_uid}
							</Col>
						</Col><Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>订单状态：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{ ORDER_STATUS_DETAIL[basic.order_status] || basic.order_status }
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>所属商圈：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.aoiname}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>联系人姓名：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.user_name}
							</Col>
						</Col><Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>订单来源：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.source_name}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>商户电话：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.shop_phone}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>联系电话：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.user_phone}
							</Col>
						</Col><Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>订单类型：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{ IMMEDIATE_DELIVER[basic.immediate_deliver] || basic.immediate_deliver }
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>商户地址：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.shop_address}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>配送地址：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.user_address}
							</Col>
						</Col><Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>下单时间：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.order_time}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>用户备注：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.remark}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>期望送达：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.expect_time}
							</Col>
						</Col>
						
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>发票信息：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{detail.invoice_title}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>出餐时间：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{basic.dishes_time}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>小票信息：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{ basic.has_ticket ? 
									<a href="javascript:void(0);" onClick={() => this.showOrderTicket(basic.orderid)}>查看</a>
								: '无'}
							</Col>
						</Col>
						<Col className="gutter-row" span={8}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>取餐应付：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{'¥' + basic.total_price + '元'}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={16}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>实付：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{'¥' + basic.total_real_price + '元'}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={16}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>送餐应收：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{'¥' + basic.user_price + '元' + (basic.pay_type > 0 ? '（已在线支付）' : '')}
							</Col>
						</Col>
					</Row>
					<br/>
					<Row gutter={16}>
						<Col className="gutter-row" span={8} offset={16}>
							<Col className="gutter-row" span={8} style={{textAlign:"right"}}>
								<b>实收：</b>
							</Col>
							<Col className="gutter-row" span={16}>
								{'¥' + basic.user_real_price + '元'}
							</Col>
						</Col>
					</Row>
					<br/>
					<br/>
					<div>
						<h2>
							订单详细内容
						</h2>
						<hr/>
						<br/>
						<Row gutter={16}>
							<Col className="gutter-row" span={24}>
								<b>订单总金额：</b>{detail.real_total_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>优惠后金额：</b>{detail.user_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>菜品金额：</b>{detail.product_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>餐盒费：</b>{detail.box_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>配送费：</b>{detail.discount_send_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>优惠金额：</b>{detail.discount_price}元&nbsp;&nbsp;&nbsp;&nbsp;
							</Col>
						</Row>
						<br/>
						<Row gutter={16}>
							<Col className="gutter-row" span={24}>
								<b>优惠信息：</b>{detail.discount_info}&nbsp;&nbsp;&nbsp;&nbsp;
							</Col>
						</Row>
						<br/>
						<Row gutter={16}>
							<Col className="gutter-row" span={24}>
								<b>结算信息：折后菜品金额：</b>{detail.shop_after_discount_price}元&nbsp;&nbsp;&nbsp;&nbsp;
								<b>总折扣金额：</b>{detail.shop_discount_price}元&nbsp;&nbsp;&nbsp;&nbsp;
							</Col>
						</Row>
					</div>
					<br/>
					<div>
						<h3>
							菜品信息：
						</h3>
						<br/>
						<Table 
							pagination={false}
							dataSource={ this.tableDataPipe(detail.product) }
							columns={productColumns}
							size="middle"
							bordered  />
					</div>
					<br/>
					<div>
						<h3>
							订单操作日志：
						</h3>
						<br/>
						<Table 
							pagination={false}
							dataSource={ this.tableDataPipe(orderDetail.sys_log)}
							columns={sys_logColumns}
							size="middle"
							bordered />
					</div>
					<br/>
					<div>
						<h3>
							订单追踪：
						</h3>
						<br/>
						<Table 
							pagination={false}
							dataSource={ this.tableDataPipe(orderDetail.operate_log)}
							columns={operate_logColumns} 
							size="middle"
							bordered />
					</div>
				</div>
				
            </Modal>
			<AnotherImageModal
				show = { this.state.orderTicketModalShow }
				filename = { this.state.orderTicketImgUrl }
				closeAction = { () => this.closeOrderTicketModal() }
			/>
			</div> ) : <div></div>)
	}

}
