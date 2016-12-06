import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import MultiSelect from 'comp/MultiSelect';
import { getInitialTeamArrays, getInitialAoiArrays, getInitialPartnerArrays, getSelectedValue, getInitialValue, getPartnerArraysByAoi, getAoiArraysByPartner } from './utils';
/**
 * 组件属性申明
 * @type: forward, reverse, null
 */
const propTypes = {
};

const TEAM = 'team';
const AOI = 'aoi';
const PARTNER = 'partner';
const TYPES_ARRAY = [TEAM, AOI, PARTNER];
export default class MultiTeamAoiPartnerSelect extends React.Component {
    constructor(props) {
        super(props);
        const preSlist = props.teamList || window._INITDATA_.slist;
        let slist = [];
        preSlist.map(
            (item) => item.sid != 2000000 && slist.push(item)
        );
        const { data, initialValue, value } = props;
        this.state = {
            areaData: {
                [TEAM]: getInitialTeamArrays(value[TEAM], slist),
                [AOI]: props.type === 'reverse' ? getAoiArraysByPartner(value[PARTNER], data) : getInitialAoiArrays(value[AOI], data),
                [PARTNER]: props.type === 'forward' ? getPartnerArraysByAoi(value[AOI], data) : getInitialPartnerArrays(value[PARTNER], data)
            },
            value: getInitialValue(data, initialValue, slist),
            selectType: props.type === 'forward' ? AOI : props.type === 'reverse' ? PARTNER : '',
            showAoiPartner: value[TEAM] && value[TEAM].length <= 1
        }
    }
    componentWillMount() {
        // 初始化单个team的情况，配置了多个team不请求，没配置team默认北京
        const {updateDataAction, value} = this.props;
        if (updateDataAction) {
            if ($.isArray(value[TEAM]) && value[TEAM].length === 1) {
                updateDataAction(value[TEAM][0]);
            } else if (!$.isArray(value[TEAM])) {
                updateDataAction('1');
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const { data, value, onChange, updateDataAction, type } = nextProps;
        const { showAoiPartner } = this.state;
        const preSlist = this.props.teamList || window._INITDATA_.slist;
        let slist = [];
        preSlist.map(
            (item) => item.sid != 2000000 && slist.push(item)
        );
        
        if (!this.compareProps(this.props, nextProps)) {
            if (this.compareCurrentTeam(nextProps)) {
                let areaData;
                switch (type) {
                    case 'forward':
                        areaData = {
                            [TEAM]: getInitialTeamArrays(value[TEAM], slist),
                            [AOI]: (value[TEAM] && value[TEAM].length > 1) ? [] : getInitialAoiArrays(value[AOI], data),
                            [PARTNER]: (value[TEAM] && value[TEAM].length > 1) ? [] : getPartnerArraysByAoi(value[AOI], data)
                        };
                        break;
                    case 'reverse':
                        areaData = {
                            [TEAM]: getInitialTeamArrays(value[TEAM], slist),
                            [AOI]: (value[TEAM] && value[TEAM].length > 1) ? [] : getAoiArraysByPartner(value[PARTNER], data),
                            [PARTNER]: (value[TEAM] && value[TEAM].length > 1) ? [] : getInitialPartnerArrays(value[PARTNER], data)
                        };
                        break;
                    default:
                        areaData = {
                            [TEAM]: getInitialTeamArrays(value[TEAM], slist),
                            [AOI]: (value[TEAM] && value[TEAM].length > 1) ? [] : getInitialAoiArrays(value[AOI], data),
                            [PARTNER]: (value[TEAM] && value[TEAM].length > 1) ? [] : getInitialPartnerArrays(value[PARTNER], data)
                        };
                        break;
                }
                let areaValue = {
                    [TEAM]: getSelectedValue(areaData[TEAM]),
                    [AOI]: getSelectedValue(areaData[AOI]),
                    [PARTNER]: getSelectedValue(areaData[PARTNER])
                }
                this.setState({
                    areaData,
                    value: areaValue,
                    showAoiPartner: value[TEAM] && value[TEAM].length <= 1
                });
                if (type === 'forward') {
                    this.state.selectType === AOI && onChange && onChange(areaValue);
                } else if (type === 'reverse') {
                    this.state.selectType === PARTNER && onChange && onChange(areaValue);
                } else {
                    onChange && onChange(areaValue);
                }
            } else {
                updateDataAction && value[TEAM][0] && updateDataAction(value[TEAM][0]);
            }
        }
    }
    // true 一致，不需要重新请求
    compareCurrentTeam(props) {
        const { data, value } = props;
        const selectedTeam = value[TEAM];
        let dataTeam;
        if (selectedTeam && $.isArray(selectedTeam) && selectedTeam.length > 1) {
            return true;
        } else if (selectedTeam && $.isArray(selectedTeam) && selectedTeam.length == 1) {
            for (let key in data) {
                dataTeam = key;
            }
            if (dataTeam == selectedTeam[0]) {
                return true;
            }
        }
        return false;
    }
    compareProps(oldProps, newProps) {
        // 仅对比data和value
        if (oldProps.data && newProps.data) {
            let oldDataKey = '', newDataKey = '';
            for (let key in oldProps.data) {
                oldDataKey = key;
            }
            for (let key in newProps.data) {
                newDataKey = key;
            }
            if (oldDataKey != newDataKey) {
                return false;
            }
        } else if (oldProps.data || newProps.data){
            return false;
        }
        if (oldProps.value && newProps.value) {
            for (let i = 0; i < TYPES_ARRAY.length; i++) {
                let type = TYPES_ARRAY[i];
                if (oldProps.value[type] && newProps.value[type]) {
                    if (oldProps.value[type].join() != newProps.value[type].join()) {
                        return false;
                    }
                } else if (oldProps.value[type] || newProps.value[type]){
                    return false;
                }
            }
        } else if (oldProps.value || newProps.value) {
            return false;
        }
        return true;
    }
    teamSelectChange(values) {
        const { updateDataAction } = this.props;
        let showAoiPartner;
        // 单选时可对商圈合作方进行选择，此时需要请求数据权限数据
        if (values && $.isArray(values) && values.length === 1) {
            // updateDataAction && updateDataAction(values[0]);
            showAoiPartner = true;
        } else {
            showAoiPartner = false;
        }
        this.setState({
            showAoiPartner,
            selectType: AOI,
            value: {
                [TEAM]: values
            }
        });
        return {
            [TEAM]: values,
            [AOI]: '',
            [PARTNER]: ''
        };
    }
    aoiPartnerSelectChange(values, type) {
        const { value } = this.state;
        let newValue = {
            ...value,
            [type]: values
        }
        this.setState({
            value: newValue,
            selectType: type
        });
        return newValue;
    }
    get getAoiPartner() {
        const { config, disabled, type, onChange } = this.props;
        const { disabledTeam, disabledAoi, disabledPartner, showAoiPartner, areaData } = this.state;
        let aoiPartner = [<MultiSelect 
                            name = { AOI }
                            data = { areaData[AOI] }  
                            disabled = { disabledAoi || disabled }
                            includeSelectAllOption = { true }
                            enableFiltering={ true }
                            onChange = { e => onChange(this.aoiPartnerSelectChange(e, AOI)) }
                            label = { '商圈' }
                            width = { config[AOI]['width'] || 150 }
                            key = { AOI }
                        />, <MultiSelect 
                            name = { PARTNER }
                            data = { areaData[PARTNER] }  
                            disabled = { disabledPartner || disabled }
                            includeSelectAllOption = { true }
                            enableFiltering={ true }
                            onChange = { e => onChange(this.aoiPartnerSelectChange(e, PARTNER)) }
                            label = { '合作方' }
                            width = { config[PARTNER]['width'] || 150 }
                            key = { PARTNER }
                        />];
        if (showAoiPartner) {
            if (type == 'reverse') {
                return aoiPartner.reverse();
            } else {
                return aoiPartner;
            }
        }
        else {
            return '';
        }
    }
    render() {
        const { config, onChange, disabled } = this.props;
        const { disabledTeam, disabledAoi, disabledPartner, showAoiPartner, areaData } = this.state;
        return  (
            <div className="areaSelect" ref="areaSelect">
                <MultiSelect 
                    name = { TEAM }
                    data = { areaData[TEAM] }  
                    disabled = { disabledTeam || disabled }
                    includeSelectAllOption = { true }
                    enableFiltering={ true }
                    onChange = { e => onChange(this.teamSelectChange(e)) } 
                    width = { config[TEAM]['width'] || 150 }
                    key = { TEAM }
                />
                {this.getAoiPartner}
            </div>
        )
    }
    
}
