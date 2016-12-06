/**
 * @file 基础组件，分页组件
 *       modified by lihuan<lihuan@iwaimai.baidu.com>
 * 
 * @author zhangyinhui <498821924@qq.com>
 * @version 0.0.1
 * 
 */
import React, { PropTypes } from 'react';
import Show from 'comp/Show';
import './styles.less';

/**
 * 组件属性申明
 * 
 * @property {object} status 分页属性 { page: 2, page_total: 10 } 总共10页，第2页，必须
 * @property {function} gotoPage 跳到某页 【一个参数，参数为index】
 */
const propTypes = {
	status: PropTypes.object.isRequired,
	gotoPage: PropTypes.func.isRequired
}

/**
 * 主组件
 * 
 * @export
 * @class Pagination
 * @extends {React.Component}
 */
export default class Pagination extends React.Component {
	/**
     * Creates an instance of Pagination.
     * 
     * @param {any} props
     * 
     * @memberOf Pagination
     */
	constructor(props) {
		super(props)
	}

    /**
     * 组件属性申明
     * 
     * @type {propTypes}
     * @memberOf Tag
     */
	propTypes: propTypes
	
	/**
     * 获取页码展示数组 pure
     * 
     * @param {Number} page 当前页
     * @param {Number} page_total 总页数
     * @param {Function} gotoPage 翻页行为
     * @return {Array} 页码列表
     * 
     * @memberOf Pagination
     */
	getPageNumList(page, page_total, gotoPage) {
		
		const _list = []
		// const { status: { page_total, page }, gotoPage } = this.props
		
		const getHtml = (index) => {
			return (
				<li className={page === index?"active":""} key={index}>
					<a onClick={gotoPage.bind(null, index)} href="javascript:;">{index}</a>
				</li>
			)
		}
		
		if(page_total > 10){
			let _startIndex = page - 5 > 0 ? page - 5 : 1
			let _endIndex = page + 4 > page_total ? page_total : page + 4
			
			_endIndex = _endIndex > 10 ? _endIndex : 10
			
			for(var i = _startIndex; i <= _endIndex; i++){
				_list.push( getHtml(i) )
			}
		}else{
			for(var i = 1; i <= page_total; i++){
				_list.push( getHtml(i) )
			}
		}
		
		return _list
		
	}
	
	/**
     * 获取上一页 pure
     * 
     * @param {Number} page 当前页
     * @param {Function} gotoPage 翻页行为
     * @return {HTMLElement} 上页标签
     * 
     * @memberOf Pagination
     */
	getPrePage (page, gotoPage){
        // const { status: { page }, gotoPage } = this.props
		
		return (
			<li>
				{ page !== 1 ?
					<a onClick={gotoPage.bind(null, 1)} href="javascript:;" aria-label="首页">
						<span aria-hidden="true">&laquo;</span>
					</a> :
					<a className="wl-pagination-disabled">
						<span aria-hidden="true">&laquo;</span>
					</a> }
				
			</li>
		)
	}
	
	/**
     * 获取下一页 pure
     * 
     * @param {Number} page 当前页
     * @param {Number} page_total 总页数
     * @param {Function} gotoPage 翻页行为
     * @return {HTMLElement} 下页标签
     * 
     * @memberOf Pagination
     */
	getNextPage (page, page_total, gotoPage){
        // const { status: { page_total, page }, gotoPage } = this.props
		
		return (
			<li>
				{ page !== page_total ?
					<a onClick={gotoPage.bind(null, page+1)} href="javascript:;" aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a> :
					<a className="wl-pagination-disabled">
						<span aria-hidden="true">&raquo;</span>
					</a> }
			</li>
		)
	}

	render() {
        const { status: { page_total, page }, gotoPage } = this.props

		return  (
			<div className="wl-pagination-wrap">
				<ul className="wl-pagination-ul">
					{this.getPrePage(page, gotoPage)}
					{this.getPageNumList(page, page_total, gotoPage)}
					{this.getNextPage(page, page_total, gotoPage)}
				</ul>
			</div>
		)
		
	}

}
