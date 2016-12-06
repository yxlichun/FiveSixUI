import React, { PropTypes } from 'react';
import {Link} from 'react-router'
import { Form, FormControl, FormGroup, ControlLabel, Col, Radio,Button } from 'react-bootstrap'
import { Icon,InputNumber,Input } from 'antd'
import './styles.less'

/**
 * 组件属性申明
 *
 *
 */
const propTypes = {
	items: PropTypes.array.isRequired,
 // 	changeTab: React.PropTypes.func.isRequired
}

/**
 * 里程计价组件
 */
export default class MileStep extends React.Component {
	constructor(props) {
		super(props)
	}

	propTypes: propTypes

	render() {
		const {items,onDelete,isEdit,onAdd,onChange} = this.props
		return  (
		    <div className="mile-step">
			    <ul className="mile-step-bar clear-float">
			    	{items && items.map((item, index) => {
			    		return (
				    		<li key={index}>
				    			<label className="mile-stone">
				    				<InputNumber
				    					step={0.1}
				    					onChange={onChange.bind(this,index)}
				    					disabled={!isEdit || index == 0}
				    					min={ items[index - 1] ? (Number((items[index - 1].min_metre/1000).toFixed(1)) + 0.1) : 0 }
				    					max={ items[index + 1] ? (Number((items[index + 1].min_metre/1000).toFixed(1)) - 0.1) : 9999 }
				    					value={(Number(item.min_metre)/1000).toFixed(1) || 0}  />
				    				{(index == 0 || items.length < 3 || !isEdit || items.length != index + 1) ? '' :(<Icon onClick={onDelete.bind(this,index)} type="cross-circle" className="close-btn" />)}
				    			</label>

				    			<label className="mile-arrow">{'→'}</label>
					    	</li>
				    	)
			    	})}
			    	<li>
		    			<label className="mile-stone infinity">
		    				<Input disabled={true} defaultValue={'∞'} />
		    			</label>
			    	</li>
			    	{items && items.length < 5 ? (<li>
		    			<Button bsStyle="info" onClick={onAdd.bind(this)}>添加</Button>
			    	</li>) : ''}

			    </ul>
		    </div>
		)
	}
}
