import React, { Component, PropTypes} from 'react';
import { Crumb, ImageModal } from 'comp';

export default class Homepage extends Component { 
    render() {
        return (
            <div>
                <Crumb
                    data = {[{title: '骑士管理', link: 'www.baidu.com'},{title: '装备管理'}]}
                />
                <ImageModal 
                    src = 'http://yizhan.baidu.com/static/logisticsfrontend/images/sound_d165ad8.png'
                    show = { true }
                />
            </div>
        )
        
    }
}