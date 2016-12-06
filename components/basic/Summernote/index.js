/**
* @file 富文本编辑器Summernote组件
*       modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
* 
* @author lichun<lichun@iwaimai.baidu.com>
* @version 0.0.1
* 
*/
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import './styles.less';


const DEFAULT_CONFIG = {
    height: 300,
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        // ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['Insert', ['picture', 'link', 'table']],
        ['Misc', ['fullscreen', 'codeview']]
    ]
};

/**
 * 组件属性申明
 * 
 * @property {string}        name              组件名                 默认值：''
 * @property {string}        initialValue      初始值                 默认值：''
 * @property {bool}          disabled          是否可编辑             默认值：false
 * @property {string}        uploadImgUrl      上传图片url            默认值：''
 * @property {object}        config            summernote配置
 * @property {func}          onChange          变化时回调函数
 */
const propTypes = {
    initialValue: PropTypes.string,
    disabled: PropTypes.bool,
    uploadImgUrl: PropTypes.string,
    config: PropTypes.object,
    onChange: PropTypes.func
}

/**
  * 主组件
  * 
  * @export
  * @class Summernote
  * @extends {React.Component}
  */
export default class Summernote extends React.Component {
    static defaultProps = {
        name: '',
        initialValue: '',
        disabled: false,
        uploadImgUrl: '',
        config: DEFAULT_CONFIG,
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const oldValue = this.props.initialValue;
        const newValue = nextProps.initialValue;

        if (oldValue !== newValue) {
            this.$summernote.summernote('code', newValue);
        }

        if (!this.props.disabled && nextProps.disabled) {
            this.$summernote.summernote('disable');
        }
    }

    componentDidMount() {
        const { name, config, uploadImgUrl, onChange, initialValue, disabled } = this.props;

        this.$summernote = $(findDOMNode(this.refs['summernote' + name]));

        this.$summernote.summernote({
            ...DEFAULT_CONFIG,
            ...config,
            callbacks: {  
                onImageUpload: (files) => {
                    for (var i = 0; i < files.length; i++ ) {
                        this.uploadImg(this.$summernote, files[i], uploadImgUrl);
                    }
                },
                onChange: (content) => onChange(content)
            } 
        });

        this.$summernote.summernote('code', initialValue);

        if (disabled) {
            this.$summernote.summernote('disable');
        }
    }
    
    render() {
        return (
            <div className = "wl-summernote-con">
                <input ref = { 'summernote' + this.props.name } />
            </div>
        )
    }

    /**
     * 上传图片
     * 
     * @param {object} $el  包裹元素
     * @param {object} file 文件
     * @param {string} url  请求url
     * 
     * @memberOf Summernote
     */
    uploadImg($el, file, url) {
        let formData = new FormData();
        formData.append("file", file);

        $.ajax({
            url,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                $el.summernote('insertImage', data.data);
            }
        });
    }
}
