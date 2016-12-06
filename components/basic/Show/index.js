/**
* @file 是否展示组件
*       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
* 
* @author zhangyinhui <498821924@qq.com>
* @version 0.0.1
* 
*/
import React, { PropTypes } from 'react';
import './styles.less';

/**
 * 组件属性申明
 *
 * @property {bool} isShow 是否显示
 * @property {bool} delay 是否延迟，默认不延迟（延迟时，当isShow为false时会消除该dom）
 */
const propTypes = {
      isShow: PropTypes.bool.isRequired,
      delay: PropTypes.bool,
}

/**
 * 主组件
 * 
 * @export
 * @class Show
 * @extends {React.Component}
 */
export default class Show extends React.Component {
    static defaultProps = {
        delay: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { isShow, delay } = this.props;

        /**
	     * delay逻辑判断说明
	     * 
	     * delay为true时，isShow为true返回该组件，false时返回null，即消除该dom
	     * delay为false时，isShow为true返回该组件，false时更改display为none
	     */
	     
        return (
        	<div 
        		style = {{ display: delay || isShow ? 'block' : 'none' }} 
    			className = 'wl-show-animated wl-show-slideInUp'
    		>
	            { !delay || isShow ? this.props.children : null }
	        </div>
	    );
    }
}
