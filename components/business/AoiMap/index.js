import React, { Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Card,Modal, Table, Form, Input, Row, Col, Button, Select, Popconfirm } from 'antd';
import MapCircle from './mapcircle';
import './style.less';
const FormItem = Form.Item;
let maptool = new BMap.MercatorProjection();
/**
 * 画商圈组件
 */
export default class AoiMap extends Component {
    constructor(props){
        super(props);
        this.state = {
            backPolygonsDrawed: false,
            isEditing: false,
        };
    }
    static defaultProps = {
        mapStyle: {height:'450px', width:'100%'},
        polygons: [],
        backPolygons:[],
        center:{cityName:"北京市"},
        enableEditing: true,
        operator: {
            edit: {
                show: true
            },
            clear: {
                show: true
            },
            save: {
                show: true
            },
            reset: {
                show: true
            },
            delete: {
                show: false
            },      
            viewAll: {
                show: true
            }
        }

    };  // 注意这里有分号

    static propTypes = {
        mapStyle: React.PropTypes.object,
        operator: React.PropTypes.object,
        polygons: React.PropTypes.array,//多边形坐标数组
        center: React.PropTypes.object,
        backPolygons:React.PropTypes.array,//多边形坐标数组,背景
        onSave:React.PropTypes.func,
        enableEditing:React.PropTypes.bool,
    };  // 注意这里有分号

    componentDidMount() {
        const { enableEditing } = this.props;

        this.aoimap = new MapCircle('mapCon');
        this.aoimap.drawBackPolygons(this.props.backPolygons);
        this.aoimap.drawPolygons(this.props.polygons, enableEditing);
        (!this.props.polygons || this.props.polygons.length == 0) && this.aoimap.setCenter(this.props.center);
    }

    componentWillReceiveProps(){
        const { enableEditing } = this.props;

        //测试代码
        // if (this.props.backPolygons && this.props.backPolygons.length && !this.state.backPolygonsDrawed) {
        //     this.setState({
        //         backPolygonsDrawed:true
        //     });
        //     setTimeout(()=>{
        //         this.aoimap.dispose();
        //         this.aoimap.drawBackPolygons(this.props.backPolygons);
        //         this.aoimap.drawPolygons(this.props.polygons);
        //     },1000);
        //
        // }
        setTimeout(()=>{
            this.aoimap.dispose();
            this.aoimap.drawBackPolygons(this.props.backPolygons);
            this.aoimap.drawPolygons(this.props.polygons, enableEditing);
        },1000);

    }

    reset() {
        const { enableEditing } = this.props;
        
        this.aoimap.dispose();
        this.aoimap.drawPolygons(this.props.polygons, enableEditing);
    }

    save() {
        var regions = [];
        var polygons = this.aoimap.getPolygons();
        for (var i = 0; i < polygons.length; i++) {
            var polygon = polygons[i];
            var path = polygon.getPath();
            var points = [];
            for (var j = 0; j < path.length; j++) {
                var mercatorObj = maptool.lngLatToPoint(path[j]);
                var point = {
                    lng:path[j].lng,
                    lat:path[j].lat,
                    longitude:path[j].lng,
                    latitude:path[j].lat,
                    x:mercatorObj.x,
                    y:mercatorObj.y
                }
                points.push(point);
            };
            regions.push(points);
        };
        // console.log(regions);
        this.props.onSave && this.props.onSave(regions);
    }
    dele() {
        this.props.onDelete && this.props.onDelete();
    }
    edit() {
        let { isEditing } = this.state;
        isEditing = !isEditing;

        if (isEditing) {
            this.aoimap.open();
        } else {
            this.aoimap.close();
        }
        this.setState({
            isEditing
        })
    }
    clear() {
        this.aoimap.dispose();
    }
    viewAll() {
        this.aoimap.resetViewport();
    }

    render() {
        const reset = this.reset.bind(this);
        const save = this.save.bind(this);
        const edit = this.edit.bind(this);
        const clear = this.clear.bind(this);
        const viewAll = this.viewAll.bind(this);
        const dele = this.dele.bind(this);
        const { operator } = this.props;
        const { isEditing } = this.state;

        return (
            <div className="aoi-map">
                <div className="aoi-map-toolbar">
                    { operator['edit'].show ? <Button type={isEditing ? "primary" : "ghost"} icon="edit" onClick={edit}>编辑</Button> : '' }
                    { operator['clear'].show ? <Button type="ghost" icon="delete" onClick={clear}>清空</Button> : '' }
                    { operator['reset'].show ? <Button type="ghost" icon="rollback" onClick={reset}>重置</Button> : '' }
                    { operator['save'].show ? <Button type="ghost" icon="check" onClick={save}>保存</Button> : '' }
                    { operator['delete'].show ? <Button type="ghost" icon="delete" onClick={dele}>删除</Button> : '' }                 
                    { operator['viewAll'].show ? <Button type="ghost" icon="eye" onClick={viewAll}>视野</Button> : '' }
                </div>
                <div id="mapCon" style={this.props.mapStyle}  data-node="mapCon" ref="mapCon">
                </div>
            </div>
        );
    }
}
