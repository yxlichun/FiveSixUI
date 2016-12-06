import React, { PropTypes } from 'react';
import { Input } from 'antd';
import { getAgeByIdCard } from 'src/utils/utils';
const propTypes = {
    idcardNo: PropTypes.string.isRquired
}


/**
 * 主组件
 * 根据身份证号码计算年龄
 * @class ShowAge
 * @extends {React.Component}
 */
export default class ShowAge extends React.Component {

	constructor(props) {
		super(props)
	}

	propTypes: propTypes

	render() {
        const { idcardNo, ...other } = this.props;
        return (
            <Input
                value = { getAgeByIdCard(idcardNo) }
                { ...other }
            />
        )
	}
}
