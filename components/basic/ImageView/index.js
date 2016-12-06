import React, { PropTypes } from 'react';
import './styles.less';

/**
 * 组件属性申明
 * @src 图片src
 */
const propTypes = {
  	src:  PropTypes.string.isRequired
}

/**
 * 完整组件
 */
export default class ImageView extends React.Component {

	constructor(props) {
		super(props)

        this.state = {
            show: false,
            previewStyle: "preview-style-leave"
        }
	}

    showImagePreview() {
        this.setState ({
            show: true,
            previewStyle: "preview-style-enter"
        })
    }

    hideImagePreview() {
        this.setState ({
            show: false,
            previewStyle: "preview-style-leave"
        })
    }

	render() {
        const { src } = this.props
        const { show, previewStyle } = this.state

		return  (
		    <imageview>

                <img
                    onClick = {this.showImagePreview.bind(this)}
                    src     = {src}
                    style   = {this.props.style || {}}
                    {...this.props}
                />

                <div
                    onClick     = {this.hideImagePreview.bind(this)}
                    style       = { {display: (show?'block':'none')}}
                    className   = "imageview-preview-wrap">
                    <img className = {previewStyle} src={src} />
                </div>

            </imageview>
		)
	}

}
