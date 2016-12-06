import React, { PropTypes } from 'react';
import { Icon } from 'antd';

import './styles.less';

const propTypes = {
}

/**
 * 建设中页面提示；
 */
export default class PageTips extends React.Component {

	constructor(props) {
		super(props)
	}

	propTypes: propTypes

	render() {
		const { href } = this.props;
        return (
            <div className="page-tips">
				<div className="page-tips-img">
                	<img src = { __uri('static/images/building.png') }/>
				</div>
				<div className="page-tips-tips">
					此功能正在奋力开发中，请先访问<a href={ href } target="_blank">旧版 <Icon type="swap-right" /></a>
				</div>
            </div>
        )
	}
}